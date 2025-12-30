// app/api/toy/[id]/giftrequest.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { getClerkUserById } from '@/lib/clerk';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id, locale } = await params;
  const limitStr = req.nextUrl.searchParams.get("limit") || undefined;
  const pageStr = req.nextUrl.searchParams.get("page") || undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : 6;
  const page = pageStr ? parseInt(pageStr, 10) : 1;

  // Validar que sea un número válido
  const limitNumber = isNaN(limit) || limit < 1 ? 6 : limit;
  const pageNumber = isNaN(page) || page < 1 ? 1 : page;

  const g = await getTranslations("General");
  const t = await getTranslations("Toy");

  let { userId } = await auth();
  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const userLanguageCode = locale;

  const languageExists = await prisma.language.findUnique({
    where: { code: userLanguageCode },
  });

  if (!languageExists) {
    throw new Error("Language ${userLanguageCode} not supported");
  }

  try {
    if (!id) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }

    // Buscar el juguete con todas sus GiftRequests
    const toyWithRequests = await prisma.toy.findUnique({
      where: { id: id },
      include: {
        // Incluir las solicitudes donde este juguete es el objetivo
        giftrequests: {
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                name: true,
                email: true,
                // *** Incluir los juguetes del usuario que solicita ***
                toysForSale: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                    // *** Incluir la media (imágenes) de los juguetes ***
                    media: {
                      select: {
                        fileUrl: true,
                      },
                      take: 1, // Puedes limitar a solo una imagen por eficiencia
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!toyWithRequests) {
      return NextResponse.json({ error: t("NotFound") }, { status: 401 });
    }

    const giftRequests = toyWithRequests.giftrequests;

    // 1. Crear un array de promesas para obtener la información del usuario de Clerk
    const clerkUserPromises = giftRequests.map(async (request) => {
      // El 'id' de tu modelo 'user' es el 'clerkId'
      const clerkUser = await getClerkUserById(request.user.clerkId);
      // Si la llamada es exitosa, devolver el 'imageUrl', si no, devolver 'null' o un valor predeterminado
      return clerkUser?.image_url || null;
    });

    // 2. Ejecutar todas las promesas en paralelo para mayor eficiencia
    const clerkImageUrls = await Promise.all(clerkUserPromises);

// Estructurar la respuesta
    const giftRequestsData = {
      id: toyWithRequests.id,
      name: toyWithRequests.title,
      description: toyWithRequests.description,

      giftRequests: toyWithRequests.giftrequests.map((giftrequests, index) => {
        // 3. Incluir el imageUrl obtenido
        const imageUrl = clerkImageUrls[index]; 

        return {
          id: giftrequests.id,
          user: {
            id: giftrequests.user.id,
            name: giftrequests.user.name,
            email: giftrequests.user.email,
            imageUrl: imageUrl // ¡Aquí está el avatar!
          },
        };
      }),
    };

    return NextResponse.json({
      success: true,
      data: giftRequestsData,
      pagination: {
        total: giftRequestsData.giftRequests.length,
        totalPages: Math.ceil(
          giftRequestsData.giftRequests.length / limitNumber
        ),
        currentPage: pageNumber,
        perPage: limitNumber,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: g("InvalidInputParams") },
      { status: 400 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let { userId } = await auth();

  const t = await getTranslations("Toy");
  const g = await getTranslations("General");
  const s = await getTranslations("Status");

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  const { id } = await params; // Safe to use

  const toy = await prisma.toy.findUnique({
    where: { id: id },
  });

  if (!toy) {
    return NextResponse.json(
      { success: false, error: t("NotFound") },
      { status: 404 }
    );
  }

  if (toy.sellerId == user.id) {
    return NextResponse.json(
      { success: false, error: g("Unauthorized") },
      { status: 403 }
    );
  }

  const statusAvailable = await prisma.status.findUnique({
    where: { name: "available" },
  });
  if (!statusAvailable) {
    return NextResponse.json(
      { success: false, error: s("NotFound") },
      { status: 400 }
    );
  }

  if (toy.statusId != statusAvailable.id) {
    return NextResponse.json(
      { success: false, error: t("StatusIncorrect") },
      { status: 400 }
    );
  }

  try {
    // crear la solicitud, asociada a ese juguete
    const giftrequests = await prisma.giftRequest.create({
      data: {
        userId: user.id,
        toyId: toy.id,
        forGifts: toy.forGifts,
        forChanges: toy.forChanges,
        statusId: statusAvailable.id,
        exchangeToyId: null,
      },
    });

    return NextResponse.json({ data: giftrequests }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
