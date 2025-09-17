// app/api/my-reviews/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener el usuario + sus reseñas recibidas
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        reputation: true,
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
              },
            },
            order: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Calcular promedio (aunque ya lo tienes en `reputation`, lo recalculamos para validar)
    const totalReviews = user.reviewsReceived.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              user.reviewsReceived.reduce(
                (sum: number, r: { rating: number }) => sum + r.rating,
                0
              ) / totalReviews
            ).toFixed(2)
          )
        : 0;

    return NextResponse.json(
      {
        name: user.name,
        reputation: user.reputation || 0,
        averageRating, // redundante, pero para UI
        totalReviews,
        reviews: user.reviewsReceived,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[MY_REVIEWS]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}