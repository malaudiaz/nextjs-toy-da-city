import { PrismaClient, OrderStatus, Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      OR: [{ buyerId: user?.id }, { sellerId: user?.id }],
      // Solo aplica el filtro de estado si se pasó un estado válido
      ...(statusFilter && { status: OrderStatus[statusFilter] }),
    };

    // --- 4. Consultar órdenes ---
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            toy: {
              include: {
                media: true, // Incluye imágenes/videos del juguete
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // --- 5. Respuesta ---
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
