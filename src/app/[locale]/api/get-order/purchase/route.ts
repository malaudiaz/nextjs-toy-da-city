import { PrismaClient, Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { orderWithAllRelations } from "@/types/prisma-types";

const prisma = new PrismaClient();

// Lista de estados válidos
const VALID_ORDER_STATUSES = [
  "AWAITING_CONFIRMATION",
  "CONFIRMED",
  "CANCELED",
  "TRANSFERRED",
  "REEMBURSED",
] as const;

type OrderStatusFilter = (typeof VALID_ORDER_STATUSES)[number];

function isValidOrderStatus(status: string): status is OrderStatusFilter {
  return VALID_ORDER_STATUSES.includes(status as OrderStatusFilter);
}

export async function GET(req: Request) {
  // --- 1. Autenticación ---
  let { userId } = await auth();
  const g = await getTranslations("General");

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  // --- 2. Obtener y validar parámetro `status` ---
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  let statusFilter: OrderStatusFilter | null = null;
  if (statusParam && isValidOrderStatus(statusParam)) {
    statusFilter = statusParam;
  }

  try {
    // --- 3. Construir filtro ---
    const where: Prisma.OrderWhereInput = {
      buyerId: user.id, 
      ...(statusFilter && { status: statusFilter }),
    };

    // --- 4. Consultar órdenes ---
    const orders = await prisma.order.findMany({
      where,
      include: orderWithAllRelations,
      orderBy: {
        createdAt: "desc",
      },
    });

    // --- 5. Lógica de Elegibilidad de Reseña ---

    // A. Identificar Vendedores con órdenes CONFIRMED (Lógica existente)
    const sellersWithConfirmedOrders = new Set<string>();

    orders.forEach((order) => {
      if (order.status === "CONFIRMED") {
        order.items.forEach((item) => {
          sellersWithConfirmedOrders.add(item.toy.seller.id);
        });
      }
    });

    // B. Consultar si el comprador YA ha reseñado a estos vendedores (NUEVO)
    // NOTA: Asumo que tu modelo se llama 'review' y tiene campos 'authorId' y 'sellerId'.
    // Ajusta los nombres de los campos según tu schema.prisma real.
    const reviewedSellerIds = new Set<string>();

    if (sellersWithConfirmedOrders.size > 0) {
      const existingReviews = await prisma.review.findMany({
        where: {
          reviewerId: user.id, // El comprador actual
          targetId: { in: Array.from(sellersWithConfirmedOrders) }, // Solo buscamos reviews de los vendedores relevantes
        },
        select: {
          targetId: true,
        },
      });

      existingReviews.forEach((review) => {
        reviewedSellerIds.add(review.targetId);
      });
    }

    // --- 6. Mapeo Final ---
    const ordersWithEligibility = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const sellerId = item.toy.seller.id;
        
        // ELEGIBLE SI:
        // 1. Tiene orden confirmada (está en sellersWithConfirmedOrders)
        // 2. NO ha sido reseñado aún (NO está en reviewedSellerIds)
        const isEligible = sellersWithConfirmedOrders.has(sellerId) && !reviewedSellerIds.has(sellerId);

        return {
          ...item,
          toy: {
            ...item.toy,
            seller: {
              ...item.toy.seller,
              isEligibleForReview: isEligible,
            },
          },
        };
      }),
    }));

    return NextResponse.json(ordersWithEligibility, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}