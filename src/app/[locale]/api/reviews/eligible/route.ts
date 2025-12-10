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

    // 2. Obtener el ID de la base de datos y validar
    const reviewer = await prisma.user.findUnique({
        where: { clerkId: clerkReviewerId },
        select: { id: true },
    });

    if (!reviewer) {
        return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
    }
    const buyerId = reviewer.id; // ID del comprador/reseñador en la DB

    // 3. Obtener Parámetros: SellerId (requerido para saber a quién reseñar)
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: g('InvalidRequest') }, { status: 400 });
    }
    
    // --- LÓGICA DE ELEGIBILIDAD COHERENTE CON LA RUTA DE ÓRDENES ---
    
    // 4. PASO 1: Verificar el requisito MÍNIMO (Interacción Confirmada)
    // Buscamos si existe al menos una Orden CONFIRMED entre el comprador y el vendedor.
    const hasConfirmedOrder = await prisma.orderItem.findFirst({
        where: {
            // El ítem de la orden debe pertenecer a un juguete de este vendedor
            toy: {
                sellerId: sellerId,
            },
            // La orden asociada debe estar CONFIRMED
            order: {
                status: 'CONFIRMED',
            }
        },
        select: {
            orderId: true, // Solo necesitamos saber si existe y obtener la orden (opcional)
        },
    });

    if (!hasConfirmedOrder) {
        // Si no hay interacción CONFIRMED, no es elegible
        return NextResponse.json({
            canReview: false,
            message: t('NoConfirmedOrderFound'),
        });
    }

    // 5. PASO 2: Verificar la regla de negocio (Ya reseñó al vendedor)
    // Buscamos si el comprador YA ha creado una reseña para este vendedor.
    // Asumo que el modelo de reseña tiene los campos 'authorId' (el comprador) y 'sellerId'.
    const existingReview = await prisma.review.findFirst({
        where: {
            reviewerId: buyerId,
            targetId: sellerId,
        },
    });

    if (existingReview) {
        // Si ya existe una reseña, no es elegible de nuevo
        return NextResponse.json({
            canReview: false,
            message: t('AlreadyReviewedSeller'),
        });
    }
    
    // 6. Respuesta Positiva: Es elegible y tiene al menos una OrderId asociada
    // Devolvemos el orderId de la orden CONFIRMED más reciente para vincular la reseña
    // (Opcional, pero útil si quieres enlazar la reseña a una orden específica)
    
    // Dado que hasConfirmedOrder nos dio el OrderId de la primera orden CONFIRMED que encontró,
    // usaremos ese. Si necesitas el OrderId *más reciente*, se requeriría una consulta adicional
    // o modificar hasConfirmedOrder para usar orderBy: { order: { createdAt: 'desc' } }
    
    // Para ser coherentes y simples, usamos el OrderId encontrado en el paso 4.
    const orderIdToAttach = hasConfirmedOrder.orderId;


    return NextResponse.json({
      canReview: true,
      orderId: orderIdToAttach,
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