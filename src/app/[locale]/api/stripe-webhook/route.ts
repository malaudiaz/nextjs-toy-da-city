// app/api/webhook/route.ts (o pages/api/webhook.js)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { createSale } from "@/lib/sales";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.log('❌ Error de verificación del webhook:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ✅ Escucha el evento `charge.succeeded` para tener el chargeId con certeza
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent;

    if (paymentIntentId) {
      await prisma.order.update({
        where: { paymentIntentId: paymentIntentId as string },
        data: {
          chargeId: charge.id, // Aquí sí tienes el chargeId seguro
        },
      });

      console.log(`✅ Cargo exitoso guardado: ${charge.id} para el pago ${paymentIntentId}`);
    }
  }

  // Opcional: también puedes escuchar charge.updated si necesitas más datos
  if (event.type === 'charge.updated') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent;

    if (paymentIntentId && charge.id && charge.status === 'succeeded') {
      await prisma.order.update({
        where: { paymentIntentId: paymentIntentId as string },
        data: {
          chargeId: charge.id,
        },
      });
      console.log(`🔄 Cargo actualizado y guardado: ${charge.id}`);
    }
  }

  if (event.type === 'payment_intent.created') {
    console.log(`Pago creado, no esta listo aun`);
  }

  // Puedes mantener payment_intent.succeeded para otros usos (ej: marcar como "pagado")
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log(`🟡 Pago confirmado: ${intent.id} (charge aún puede no estar listo)`);
    // Aquí no actualices chargeId si no está disponible
    const order = await prisma.order.findUnique({
      where: {
        paymentIntentId: intent.id,
      },
      include: {
        items: true,
      },
    });

    if (order) {
      const toysIDs = order.items.map(item => item.toyId);

      await createSale(toysIDs, order.buyerId);
    }

  }

  return NextResponse.json({ received: true });
}