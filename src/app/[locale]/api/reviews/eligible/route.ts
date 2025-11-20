// app/api/reviews/eligible/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from "next-intl/server";

export async function GET(request: Request) {

  const g = await getTranslations("General");
  const t = await getTranslations("Reviews"); 

  try {
    const { userId: clerkReviewerId } = await auth();

    // 1. Autenticación de Clerk
    if (!clerkReviewerId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }

    // 2. Obtener el ID de la base de datos
    const reviewer = await prisma.user.findUnique({
        where: { clerkId: clerkReviewerId },
        select: { id: true },
    });

    if (!reviewer) {
        return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
    }
    const buyerId = reviewer.id; // ID del comprador/reseñador en la DB

    // 3. Obtener Parámetros
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: g('InvalidRequest') }, { status: 400 });
    }
    
    // 4. Buscar orden CONFIRMED elegible a través de los ítems de la orden (OrderItem)
    // Buscamos un OrderItem donde:
    // a) El juguete (Toy) pertenezca al SellerId buscado.
    // b) La Orden (Order) esté confirmada, tenga el buyerId del usuario actual y no haya sido reseñada.
    
    // Nota: Asumimos que la relación es Order -> OrderItem -> Toy -> Seller
    const eligibleOrderItem = await prisma.orderItem.findFirst({
        where: {
            // Condición A: El juguete asociado al ítem pertenece al vendedor
            toy: {
                sellerId: sellerId,
            },
            // Condición B: La orden asociada al ítem cumple los criterios del comprador/estado/reseña
            order: {
                buyerId: buyerId,
                status: 'CONFIRMED',
                review: null, // Asume que la reseña se relaciona con la ORDEN, no con el OrderItem.
            }
        },
        select: {
            orderId: true, // Obtenemos el ID de la orden para la reseña
        },
        orderBy: {
            order: {
                createdAt: 'desc', // Buscar la orden más reciente
            }
        }
    });


    // 5. Determinar Elegibilidad
    if (!eligibleOrderItem) {
      return NextResponse.json({
        canReview: false,
        message: t('NoConfirmedUnreviewedOrder'),
      });
    }
    
    // Si encontramos un OrderItem elegible, extraemos el ID de la orden
    const orderId = eligibleOrderItem.orderId;

    // 6. Respuesta Positiva
    return NextResponse.json({
      canReview: true,
      orderId: orderId,
      message: t("EligibleForReview") 
    });
  } catch (error) {
    console.error('[REVIEW_ELIGIBLE_ERROR]', error);
    return NextResponse.json(
      { error: g('ServerError') },
      { status: 500 }
    );
  }
}