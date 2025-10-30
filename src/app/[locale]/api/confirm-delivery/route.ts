import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/nodemailer";
import { getTranslations } from "next-intl/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: NextRequest) {
  const t = await getTranslations("confirmDelivery");
  const g = await getTranslations("General.errors");
  
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json(
      { error: g("UserNotFound") },
      { status: 404 }
    );
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: t("orderNotFound") }, { status: 404 });
  }
  if (order.buyerId !== user.id) {
    return NextResponse.json(
      { success: false, error: g("Unauthorized") },
      { status: 403 }
    );
  }
  if (order.status !== "AWAITING_CONFIRMATION") {
    return NextResponse.json(
      { success: false, error: t("invalidOrder") },
      { status: 400 }
    );
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
  } catch (error) {
    console.error(t("paymentIntentError"), error);
    return NextResponse.json(
      { success: false, error: t("invalidPayment") },
      { status: 500 }
    );
  }

  const transfers = JSON.parse(intent.metadata.transfers || "[]");
  if (!Array.isArray(transfers) || transfers.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: t("invalidTransfer"),
      },
      { status: 400 }
    );
  }

  // ✅ Intentar crear transferencias con manejo de errores
  const createdTransfers = [];
  for (const tfs of transfers) {
    try {
      const transfer = await stripe.transfers.create({
        amount: tfs.amount,
        currency: "usd",
        destination: tfs.stripeAccountId,
        description: t("transferDescription"),
      });

      // Guardar en DB
      const dbTransfer = await prisma.transfer.create({
        data: {
          orderId: order.id,
          sellerId: tfs.sellerId,
          amount: tfs.amount,
          stripeTransferId: transfer.id,
        },
      });

      createdTransfers.push(dbTransfer);
    } catch (error) {
      console.error(t("transferError"), error);

      let errorMessage = t("errorMessage");
      if (error instanceof Stripe.errors.StripeError) {
        if (error.code === "balance_insufficient") {
          errorMessage = t("insuficientFunds");
        } else if (error.type === "StripeInvalidRequestError") {
          errorMessage = `${t("requestError")}${error.message}`;
        }
      }

      // Opcional: revertir transferencias ya hechas (rollback manual si es crítico)
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  }

  // ✅ Actualizar estado de la orden
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "CONFIRMED",
      confirmedAt: new Date(),
      transferredAt: new Date(),
    },
  });

  // ✉️ ENVIAR CORREO DE TRANSFERENCIA COMPLETADA
  const orderWithDetails = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      buyer: { select: { email: true, name: true } },
      items: {
        include: {
          toy: { select: { title: true } },
        },
      },
    },
  });

  if (orderWithDetails?.buyer?.email) {
    await sendEmail({
      to: orderWithDetails.buyer.email,
      subject: t("subject"),
      html: `
      <div style="max-width:480px;margin:auto;background:#f8f8f8;border-radius:12px;padding:32px 24px;font-family:sans-serif;color:#222;box-shadow:0 2px 8px #0001;">
        <h2 style="color:#4c754b;margin-bottom:8px;">${t("title")}</h2>
        <p style="font-size:1.1em;margin-bottom:16px;">${t("hello")} <strong>${orderWithDetails.buyer.name}</strong>,</p>
        <p style="margin-bottom:18px;">${t("message")}</p>
        <h3 style="margin-bottom:8px;color:#4c754b;">${t("products") ?? "Productos"}</h3>
        <ul style="padding-left:18px;margin-bottom:18px;">
          ${orderWithDetails.items.map((item) => `<li style='margin-bottom:4px;'>${item.toy.title}</li>`).join("")}
        </ul>
        <a href="mailto:soporte@toydacity.com" style="display:inline-block;background:#4c754b;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:500;margin-bottom:18px;">${t("contactSupport") ?? "Contactar soporte"}</a>
        <p style="margin-top:24px;font-size:1.05em;">${t("farewell")}</p>
      </div>
    `,
    });
  }

  return NextResponse.json({ success: true });
}
