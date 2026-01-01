import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});


export async function POST(req: NextRequest) {
  let { userId } = await auth();

  const t = await getTranslations("Orders");
  const g = await getTranslations("General");

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, error: t("NotFound") },
      { status: 404 }
    );
  }

  if (order.buyerId !== user.id) {
    return NextResponse.json(
      { success: false, error: g("Unauthorized") },
      { status: 403 }
    );
  }

  if (order.status !== "AWAITING_CONFIRMATION") {
    return NextResponse.json(
      { success: false, error: t("OrderNotValid") },
      { status: 400 }
    );
  }

  // ✅ 1. LIBERAR LOS JUGUETES PRIMERO (¡clave!)
  const toyIds = order.items.map((item: { toyId: string }) => item.toyId);
  try {
    await prisma.toy.updateMany({
      where: { id: { in: toyIds } },
      data: {
        statusId: 1, // disponible
        isActive: true,
      },
    });
  } catch (dbError) {
    console.error("Error al liberar juguetes:", dbError);
    // Aunque falle, seguimos: lo importante es intentar liberar
  }

  // ✅ 2. Intentar verificar y reembolsar (si es posible)
  let refundCreated = false;
  let refundError: string | null = null;

  try {
    const paymentIntentRaw = await stripe.paymentIntents.retrieve(
      order.paymentIntentId,
      { expand: ["charges"] }
    );

    const paymentIntent = paymentIntentRaw as unknown as Stripe.PaymentIntent & {
      charges: Stripe.ApiList<Stripe.Charge>;
    };

    if (paymentIntent.status === "succeeded") {
      const charge = paymentIntent.charges.data[0];
      if (charge && charge.amount_refunded === 0) {
        const refund = await stripe.refunds.create({
          payment_intent: order.paymentIntentId,
          reason: "requested_by_customer",
        });
        refundCreated = true;

        // Guardar el reembolso
        await prisma.refund.create({
          data: {
            orderId: order.id,
            amount: order.totalAmount,
            stripeRefundId: refund.id,
          },
        });
      } else {
        refundError = "El pago ya fue reembolsado.";
      }
    } else {
      refundError = "El pago no fue completado, por lo tanto no se reembolsa.";
    }
  } catch (error) {
    console.error("Error en flujo de reembolso:", error);
    refundError = "No se pudo procesar el reembolso, pero los juguetes ya fueron liberados.";
    // ¡No retornamos aquí! Ya liberamos los juguetes.
  }

  // ✅ 3. Actualizar estado de la orden (siempre)
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: refundCreated ? "REEMBURSED" : "CANCELED",
      canceledAt: new Date(),
      reembursedAt: refundCreated ? new Date() : null,
    },
  });

  // ✅ Responder con éxito (los juguetes ya están libres)
  return NextResponse.json({
    success: true,
    message: refundError || "Reembolso procesado y juguetes liberados.",
  });
}