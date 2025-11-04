// app/api/reviews/eligible/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from "next-intl/server";

export async function GET(request: Request) {

  const g = await getTranslations("General");
  const t = await getTranslations("Orders");

  try {
    const { userId: reviewerId } = await auth();

    if (!reviewerId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: reviewerId },
        select: { id: true },
    });

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: t('SellerIdRequeried') }, { status: 400 });
    }

    // Buscar orden CONFIRMED sin reseña
    const eligibleOrder = await prisma.order.findFirst({
      where: {
        buyerId: user?.id,
        sellerId: sellerId,
        status: 'CONFIRMED',
        review: null,
      },
      select: {
        id: true,
      },
    });

    if (!eligibleOrder) {
      return NextResponse.json({
        canReview: false,
        message: 'No tienes ordenes confirmadas sin reseñar con este vendedor.',
      });
    }

    return NextResponse.json({
      canReview: true,
      orderId: eligibleOrder.id,
      message: "Puedes dejar una reseña para esta orden"
    });
  } catch (error) {
    console.error('[REVIEW_ELIGIBLE]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}