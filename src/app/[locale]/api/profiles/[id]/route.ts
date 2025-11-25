// app/api/profiles/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

/**
 * @route GET /api/users/[id]
 * @description Obtiene el perfil completo de un usuario por su ID, incluyendo reseñas,
 * juguetes en venta, rating y la URL de su avatar (y el de los revisores) desde Clerk.
 */
export async function GET(request: Request) {
    const url = new URL(request.url);
    // Extracción del ID del usuario desde el path
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments.pop(); // El último segmento es el ID del usuario

    // Inicialización de traducciones (i18n)
    const g = await getTranslations("General");
    const t = await getTranslations("User");

    // 1. Validación del ID
    if (!id) {
        return NextResponse.json({ error: t("InvaliduserID") }, { status: 400 });
    }

    try {
        // 2. Consulta a la base de datos (Prisma)
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                // Incluye las reseñas recibidas
                reviewsReceived: {
                    include: {
                        // **IMPORTANTE:** Seleccionamos el clerkId del revisor para obtener su imagen después
                        reviewer: { select: { id: true, name: true, clerkId: true } }, 
                        order: { select: { id: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                // Incluye hasta 4 juguetes activos en venta (con su primera imagen)
                toysForSale: {
                    where: { isActive: true },
                    include: {
                        category: { select: { name: true } },
                        media: { 
                            where: { type: 'IMAGE' }, 
                            take: 1, 
                            select: { fileUrl: true } 
                        },
                    },
                    take: 4,
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: t("NotFound") }, { status: 404 });
        }

        // --- Obtención de datos externos (Clerk) ---

        // 3. Obtener avatar del USUARIO DEL PERFIL (vendedor) desde Clerk
        let imageUrl: string | null = null;
        try {
            const clerkUser = await getClerkUserById(user.clerkId);
            // Clerk usa 'image_url' para la URL del avatar
            imageUrl = clerkUser?.image_url || null; 
        } catch (error) {
            console.warn(`[CLERK_FETCH] No se pudo obtener avatar del perfil: ${user.clerkId}`, error);
            imageUrl = null;
        }

        // 4. Obtener las URLs de las imágenes de los REVISORES desde Clerk
        
        // Identificar los clerkIds únicos de todos los revisores
        const reviewerClerkIds = user.reviewsReceived
            .map(review => review.reviewer.clerkId)
            // Filtra IDs nulos/vacíos y asegura que cada ID aparezca una sola vez (unique)
            .filter((id, index, self): id is string => !!id && self.indexOf(id) === index); 

        const reviewerImageUrls = new Map<string, string>();

        // Crear un array de promesas para buscar las imágenes concurrentemente
        const fetchReviewerImagesPromises = reviewerClerkIds.map(async (clerkId) => {
            try {
                const clerkUser = await getClerkUserById(clerkId);
                if (clerkUser?.image_url) {
                    // Almacenar el resultado en el Map: clave=clerkId, valor=image_url
                    reviewerImageUrls.set(clerkId, clerkUser.image_url);
                }
            } catch (error) {
                console.warn(`[CLERK_FETCH] No se pudo obtener avatar del revisor: ${clerkId}`, error);
                // Si falla, el revisor no tendrá imageUrl en la respuesta final
            }
        });

        // Ejecutar todas las llamadas a Clerk en paralelo para optimizar el tiempo
        await Promise.all(fetchReviewerImagesPromises);

        // --- Procesamiento de datos y Formateo de respuesta ---

        // 5. Calcular rating
        const totalReviews = user.reviewsReceived.length;
        const averageRating =
            totalReviews > 0
                ? parseFloat(
                      (user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
                  )
                : null;

        // 6. Formatear la respuesta final
        const profileData = {
            ...user,
            imageUrl, // Avatar del usuario del perfil (vendedor)
            averageRating,
            totalReviews,
            // Formatear la lista de juguetes para simplificar la respuesta
            toysForSale: user.toysForSale.map((toy) => ({
                ...toy,
                primaryImageUrl: toy.media[0]?.fileUrl || null,
                media: undefined, // Eliminar el array 'media' ya que usamos 'primaryImageUrl'
            })),
            // Formatear las reseñas para incluir la imageUrl de cada revisor
            reviewsReceived: user.reviewsReceived.map((review) => {
                const reviewerClerkId = review.reviewer.clerkId;
                // Obtener la imageUrl del Map que llenamos en el paso 4
                const reviewerImageUrl = reviewerClerkId 
                    ? reviewerImageUrls.get(reviewerClerkId) || null 
                    : null;

                return {
                    ...review,
                    reviewer: {
                        ...review.reviewer,
                        imageUrl: reviewerImageUrl, // <-- IMAGEN DEL REVISOR AÑADIDA AQUÍ
                        clerkId: undefined, // Opcional: Eliminar el clerkId de la respuesta pública
                    },
                };
            }),
        };

        return NextResponse.json(profileData, { status: 200 });

    } catch (error) {
        console.error('[PROFILE_GET_ERROR]', error);
        return NextResponse.json(
            { error: g("ServerError") },
            { status: 500 }
        );
    }
}