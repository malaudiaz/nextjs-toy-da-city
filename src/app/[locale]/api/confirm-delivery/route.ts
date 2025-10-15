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

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }
  if (order.buyerId !== user.id) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
  }
  if (order.status !== "AWAITING_CONFIRMATION") {
    return NextResponse.json({ success: false, error: "Orden no válida para confirmar" }, { status: 400 });
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
  } catch (error) {
    console.error("Error al recuperar PaymentIntent:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo verificar el pago." },
      { status: 500 }
    );
  }

  const transfers = JSON.parse(intent.metadata.transfers || '[]');
  if (!Array.isArray(transfers) || transfers.length === 0) {
    return NextResponse.json(
      { success: false, error: "No hay transferencias configuradas para esta orden." },
      { status: 400 }
    );
  }

  // ✅ Intentar crear transferencias con manejo de errores
  const createdTransfers = [];
  for (const t of transfers) {
    try {
      const transfer = await stripe.transfers.create({
        amount: t.amount,
        currency: 'usd',
        destination: t.stripeAccountId,
        description: `Transferencia por confirmación de entrega`,
      });

      // Guardar en DB
      const dbTransfer = await prisma.transfer.create({
         data: {
          orderId: order.id,
          sellerId: t.sellerId,
          amount: t.amount,
          stripeTransferId: transfer.id,
        }
      });

      createdTransfers.push(dbTransfer);
      
    } catch (error) {
      console.error("Error al crear transferencia:", error);

      let errorMessage = "No se pudo transferir el pago al vendedor.";
      if (error instanceof Stripe.errors.StripeError) {
        if (error.code === "balance_insufficient") {
          errorMessage =
            "Fondos insuficientes en la cuenta de Stripe. Usa la tarjeta de prueba 4000000000000077 para cargar fondos disponibles.";
        } else if (error.type === "StripeInvalidRequestError") {
          errorMessage = `Error en la solicitud: ${error.message}`;
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
      status: "TRANSFERRED",
      confirmedAt: new Date(),
      transferredAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });

}