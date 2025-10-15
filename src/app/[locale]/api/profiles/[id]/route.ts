// app/api/profiles/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const id = pathSegments.pop();

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // 1. Obtener usuario de tu DB
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        reviewsReceived: {
          include: {
            reviewer: { select: { id: true, name: true, clerkId: true } },
            order: { select: { id: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        toysForSale: {
          where: { isActive: true },
          include: {
            category: { select: { name: true } },
            media: { where: { type: 'IMAGE' }, take: 1, select: { fileUrl: true } },
          },
          take: 4,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
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

    // 3. Calcular rating
    const totalReviews = user.reviewsReceived.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
          )
        : null;

    // 4. Formatear respuesta
    const profileData = {
      ...user,
      imageUrl,
      averageRating,
      totalReviews,
      toysForSale: user.toysForSale.map((toy) => ({
        ...toy,
        primaryImageUrl: toy.media[0]?.fileUrl || null,
        media: undefined,
      })),
      reviewsReceived: user.reviewsReceived.map((review) => ({
        ...review,
        reviewer: {
          ...review.reviewer,
          clerkId: undefined,
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