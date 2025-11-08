import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getTranslations } from "next-intl/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

// Protección básica: solo ejecutar si se envía un secreto (mejorable con autenticación real)
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
  // Opcional: autenticación mínima
  const authHeader = request.headers.get("authorization");
  const g = await getTranslations("General");
  const t = await getTranslations("Orders");

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const THREE_DAYS = 72 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - THREE_DAYS);

  // Buscar órdenes que aún no se han procesado para transferencia
  const orders = await prisma.order.findMany({
    where: {
      status: "AWAITING_CONFIRMATION",
      createdAt: { lte: cutoff },
      chargeId: { not: null },
      paymentIntentId: {  not: null as unknown as string },
    },
  });

  if (orders.length === 0) {
    return NextResponse.json({ processed: 0, message: t("NotOrderToProcess") });
  }

  const results = [];

  for (const order of orders) {
    try {
      // Marcar orden como en progreso para evitar reprocesamiento
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "TRANSFER_IN_PROGRESS" },
      });

      const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId!);

      // Validar y parsear transfers
      let transfers: { amount: number; stripeAccountId: string; sellerId: string }[] = [];
      try {
        transfers = JSON.parse(intent.metadata.transfers || "[]");
        if (!Array.isArray(transfers)) throw new Error("Not an array");
      } catch (e) {
        console.error(`Invalid transfers metadata for order ${order.id}`, e);
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "ERROR", transferredAt: new Date() },
        });
        results.push({ orderId: order.id, error: t("InvalidTransfersMetadata") });
        continue;
      }

      if (transfers.length === 0) {
        // No hay transferencias → marcar como completado
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "TRANSFERRED", transferredAt: new Date() },
        });
        results.push({ orderId: order.id, success: true, transfers: 0 });
        continue;
      }

      // Realizar todas las transferencias dentro de una transacción
      const dbTransfers = await prisma.$transaction(async (tx) => {
        const createdTransfers = [];

        for (const t of transfers) {
          try {
            const transfer = await stripe.transfers.create({
              amount: t.amount,
              currency: "usd",
              destination: t.stripeAccountId,
              description: `Transferencia automática por orden ${order.id}`,
            });

            const dbTransfer = await tx.transfer.create({
              data: {
                orderId: order.id,
                sellerId: t.sellerId,
                amount: t.amount,
                stripeTransferId: transfer.id,
              },
            });
            createdTransfers.push(dbTransfer);
          } catch (error) {
            // Si falla cualquier transferencia, abortar todo
            console.error(`Transferencia fallida para orden ${order.id}:`, error);
            throw error; // Esto aborta la transacción
          }
        }

        // Solo si todas las transferencias tuvieron éxito, actualizar la orden
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "TRANSFERRED",
            transferredAt: new Date(),
          },
        });

        return createdTransfers;
      });

      results.push({
        orderId: order.id,
        success: true,
        transfers: dbTransfers.length,
      });

    } catch (error) {
      // Error grave: no se pudo completar el proceso
      console.error(`Error procesando orden ${order.id}:`, error);

      // Opcional: intentar revertir estado a AWAITING_CONFIRMATION o marcar como ERROR
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "ERROR", transferredAt: new Date() },
      });

      let errorMessage = "Error interno al procesar transferencias.";
      if (error instanceof Stripe.errors.StripeError) {
        if (error.code === "balance_insufficient") {
          errorMessage =
            "Fondos insuficientes en la cuenta de Stripe. Usa la tarjeta de prueba 4000000000000077 para cargar fondos disponibles.";
        } else if (error.type === "StripeInvalidRequestError") {
          errorMessage = `Solicitud inválida a Stripe: ${error.message}`;
        }
      }

      results.push({ orderId: order.id, error: errorMessage });
    }
  }

  const successful = results.filter(r => r.success).length;
  return NextResponse.json({
    processed: orders.length,
    successful,
    failed: results.length - successful,
    details: results,
  });
}