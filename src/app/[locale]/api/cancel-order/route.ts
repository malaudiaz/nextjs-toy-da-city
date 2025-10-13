import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

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

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });


  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order)
    return NextResponse.json({ success: false, error: "Orden no encontrada" }, { status: 404 });
  if (order.buyerId !== user.id)
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
  if (order.status !== "AWAITING_CONFIRMATION")
    return NextResponse.json({ success: false, error: "Orden no válida" }, { status: 400 });

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
