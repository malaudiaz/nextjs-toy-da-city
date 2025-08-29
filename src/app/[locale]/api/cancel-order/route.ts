import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: NextRequest) {
  const { orderId, userId } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order)
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  if (order.buyerId !== userId)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (order.status !== "AWAITING_CONFIRMATION")
    return NextResponse.json({ error: "Orden no válida" }, { status: 400 });

  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    reason: "requested_by_customer"
  });

  await prisma.refund.create({
    data: {
      orderId: order.id,
      amount: order.totalAmount,
      stripeRefundId: refund.id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "REEMBURSED",
      canceledAt: new Date(),
      reembursedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
