// app/api/my-reviews/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from "next-intl/server";

async function getClerkUserById(clerkId: string) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Clerk API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Clerk user:', error);
    return null;
  }
}

export async function GET() {

  const g = await getTranslations("General");
  
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }

    // Obtener el usuario + sus reseñas recibidas
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        clerkId: true,
        reputation: true,
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                clerkId: true
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
      return NextResponse.json({ error: g("UserNotFound")  }, { status: 404 });
    }

    // 2. Obtener avatar desde Clerk usando el clerkId del usuario del perfil
    let imageUrl: string | null = null;
    try {
      const clerkUser = await getClerkUserById(user.clerkId);
      imageUrl = clerkUser?.image_url || null; // Nota: Clerk usa "image_url" no "imageUrl"
    } catch {
      console.warn(`No se pudo obtener avatar de Clerk para clerkId: ${user.clerkId}`);
      imageUrl = null;
    }

    const reviewsWithImages = await Promise.all(
      user.reviewsReceived.map(async (review) => {
        let reviewerImageUrl = null;
        if (review.reviewer.clerkId) {
          try {
            const clerkUser = await getClerkUserById(review.reviewer.clerkId);
            reviewerImageUrl = clerkUser?.image_url || null;
          } catch {
            reviewerImageUrl = null;
          }
        }
        return {
          ...review,
          reviewer: {
            ...review.reviewer,
            imageUrl: reviewerImageUrl,
          },
        };
      })
    );    

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
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        imageUrl,
        reputation: user.reputation || 0,
        averageRating, // redundante, pero para UI
        totalReviews,
        reviews: reviewsWithImages, // <-- Usar el array enriquecido
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[MY_REVIEWS]', error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}