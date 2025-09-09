import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: NextRequest) {
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
  if (order.buyerId !== userId) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
  if (order.status !== 'AWAITING_CONFIRMATION') return NextResponse.json({ success: false, error: 'Orden no válida' }, { status: 400 });

  const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
  const transfers = JSON.parse(intent.metadata.transfers || '[]');

  for (const t of transfers) {
    const transfer = await stripe.transfers.create({
      amount: t.amount,
      currency: 'usd',
      destination: t.stripeAccountId,
      source_transaction: order.chargeId!,
      description: `Transferencia por confirmación de entrega`,
    });

    await prisma.transfer.create({
       data:{
        orderId: order.id,
        sellerId: t.sellerId,
        amount: t.amount,
        stripeTransferId: transfer.id,
      },
    });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'TRANSFERRED',
      confirmedAt: new Date(),
      transferredAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}