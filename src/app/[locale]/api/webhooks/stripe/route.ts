// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { getTranslations } from "next-intl/server";

// Desactivar el body parser automático de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

// Helper para convertir ReadableStream a Buffer
async function readRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body!.getReader();
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) chunks.push(value);
    done = streamDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const t = await getTranslations("sendMail");
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Firma no proporcionada" },
      { status: 400 }
    );
  }

  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error("Error leyendo el body:", err);
    return NextResponse.json({ error: "Error leyendo body" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error:", err.message);
    } else {
      console.error("Error desconocido:", err);
    }
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  // Manejar el evento de pago exitoso
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const buyerId = paymentIntent.metadata?.buyer_id;

    if (!buyerId) {
      console.warn("No buyer_id en metadata");
      return NextResponse.json({ received: true });
    }

    try {
      // Obtener datos del comprador y la orden
      const order = await prisma.order.findFirst({
        where: { paymentIntentId: paymentIntent.id },
        include: {
          buyer: { select: { email: true, name: true } },
          items: {
            include: {
              toy: { select: { title: true, price: true } },
            },
          },
        },
      });

      if (!order || !order.buyer?.email) {
        console.warn("Orden o email no encontrado");
        return NextResponse.json({ received: true });
      }

      // Actualizar estado de la orden
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.AWAITING_CONFIRMATION },
      });

      // ✉️ ENVIAR CORREO AL COMPRADOR
      const productos = order.items.map((item) => ({
        nombre: item.toy.title,
        precio: item.priceAtPurchase / 100, // convertir de centavos a dólares
      }));

      await sendEmail({
        to: order.buyer.email,
        subject: t("paymentSuccessSubject"), // Cambiar el asunto
        html: `
        <div style="max-width:480px;margin:auto;background:#f8f8f8;border-radius:12px;padding:32px 24px;font-family:sans-serif;color:#222;box-shadow:0 2px 8px #0001;">
          <h2 style="color:#4c754b;margin-bottom:8px;">${t("paymentSuccessGreeting")} ${order.buyer.name}!</h2>
          <p style="font-size:1.1em;margin-bottom:16px;">${t("paymentSuccessMessage")}</p>
          <div style="background:#fffbe6;padding:12px 16px;border-radius:8px;margin-bottom:18px;">
            <strong style="color:#4c754b;">${t("totalPaid")}:</strong> <span style="font-size:1.2em;">$${(paymentIntent.amount / 100).toFixed(2)}</span>
          </div>
          <h3 style="margin-bottom:8px;color:#4c754b;">${t("products")}</h3>
          <ul style="padding-left:18px;margin-bottom:18px;">
            ${productos.map((p) => `<li style='margin-bottom:4px;'>${p.nombre} <span style='color:#4c754b;font-weight:bold;'>$${p.precio.toFixed(2)}</span></li>`).join("")}
          </ul>
          <p style="margin-bottom:18px;">${t("awaitingDelivery")}</p>
          <a href="mailto:soporte@toydacity.com" style="display:inline-block;background:#4c754b;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:500;margin-bottom:18px;">${t("contactSupport") ?? "Contactar soporte"}</a>
          <p style="margin-top:24px;font-size:1.05em;">${t("farewell")}</p>
        </div>
      `,
      });
      
    } catch (err) {
      console.error("Error procesando el webhook:", err);
    }
  }

  return NextResponse.json({ received: true });
}
