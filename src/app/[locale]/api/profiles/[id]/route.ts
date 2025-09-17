// app/api/profiles/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                clerkId: true,
              },
            },
            order: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        toysForSale: {
          where: { isActive: true },
          include: {
            category: {
              select: { name: true },
            },
            media: {
              where: { type: 'IMAGE' },
              take: 1,
              select: { fileUrl: true },
            },
          },
          take: 4, // Solo los primeros 4 para el perfil
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Calcular rating promedio
    const totalReviews = user.reviewsReceived.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(2)
          )
        : null;

    // Formatear respuesta
    const profileData = {
      ...user,
      averageRating,
      totalReviews,
      toysForSale: user.toysForSale.map((toy) => ({
        ...toy,
        primaryImageUrl: toy.media[0]?.fileUrl || null,
        media: undefined, // No exponemos el array completo por seguridad/rendimiento
      })),
      reviewsReceived: user.reviewsReceived.map((review) => ({
        ...review,
        reviewer: {
          ...review.reviewer,
          clerkId: undefined, // Opcional: no exponer clerkId si no es necesario
        },
      })),
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
