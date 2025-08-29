import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function GET() {
  const THREE_DAYS = 72 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - THREE_DAYS);

  const orders = await prisma.order.findMany({
    where: {
      status: "AWAITING_CONFIRMATION",
      createdAt: { lte: cutoff },
      chargeId: { not: null },
    },
  });

  for (const order of orders) {
    const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
    const transfers = JSON.parse(intent.metadata.transfers || "[]");

    for (const t of transfers) {
      const transfer = await stripe.transfers.create({
        amount: t.amount,
        currency: "usd",
        destination: t.stripeAccountId,
        source_transaction: order.chargeId!,
        description: `Transferencia automática por orden ${order.id}`,
      });

      await prisma.transfer.create({
        data: {
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
        status: "TRANSFERRED",
        transferredAt: new Date(),
      },
    });
  }

  return NextResponse.json({ processed: orders.length });
}
