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

  // --- 2. Obtener y validar parámetro `status` ---
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  let statusFilter: OrderStatusFilter | null = null;
  if (statusParam && isValidOrderStatus(statusParam)) {
    statusFilter = statusParam;
  }
  // Si no es válido o no existe → simplemente será null, y no filtramos por estado

  try {
    // --- 3. Construir filtro ---
    const where: Prisma.OrderWhereInput = {
      buyerId: user!.id, // ✅ Solo órdenes del comprador logueado
      ...(statusFilter && { status: statusFilter }), // ✅ Solo si se pasa un estado válido
    };

    // --- 4. Consultar órdenes ---
    const orders = await prisma.order.findMany({
      where,
      include: orderWithAllRelations,
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Identificar todos los SellerIds que tienen al menos una orden 'CONFIRMED'
    // con este comprador (el usuario actual).
    const eligibleSellerIds = new Set<string>();

    orders.forEach(order => {
        // La elegibilidad para reseña solo se basa en órdenes CONFIRMED.
        // Asumimos que la reseña es por el VENDEDOR, no por la ORDEN.
        if (order.status === "CONFIRMED") {
            // Recorremos los ítems de la orden CONFIRMED
            order.items.forEach(item => {
                // Añadimos el ID del vendedor del juguete al set de elegibles
                eligibleSellerIds.add(item.toy.seller.id);
            });
        }
    });


    // 5. Mapear las órdenes para inyectar la bandera isEligibleForReview
    const ordersWithEligibility = orders.map(order => ({
        ...order,
        // Recorremos los ítems
        items: order.items.map(item => ({
            ...item,
            // Modificamos el juguete
            toy: {
                ...item.toy,
                // Modificamos el vendedor
                seller: {
                    ...item.toy.seller,
                    // ✅ INYECTAMOS EL NUEVO CAMPO DTO
                    isEligibleForReview: eligibleSellerIds.has(item.toy.seller.id),
                }
            }
        }))
    }));

    // --- 6. Respuesta FINAL ---
    // Devolvemos el array mapeado con el campo inyectado.
    return NextResponse.json(ordersWithEligibility, { status: 200 });    

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}
