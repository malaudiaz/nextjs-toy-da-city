// app/api/toy/[id]/giftrequest.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { GiftRequestSchema } from "@/lib/schemas/request";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      limit: string;
      locale: string;
      page: string;
    }>;
  }
) {
  const { id, limit: limitStr, locale, page: pageStr } = await params;
  const limit = limitStr ? parseInt(limitStr, 10) : 6;
  const page = pageStr ? parseInt(pageStr, 1) : 1;

  // Validar que sea un número válido
  const limitNumber = isNaN(limit) || limit < 1 ? 6 : limit;
  const pageNumber = isNaN(page) || page < 1 ? 6 : page;

  const g = await getTranslations("General");
  const t = await getTranslations("Toy");

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: t("ToyIdRequired") }, { status: 401 });
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
                name: true,
                email: true,
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

    // Estructurar la respuesta
    const giftRequestsData = {
      id: toyWithRequests.id,
      name: toyWithRequests.title,
      description: toyWithRequests.description,

      giftRequests: toyWithRequests.giftrequests.map((giftrequests) => {
        return {
          id: giftrequests.id,
          user: {
            id: giftrequests.user.id,
            name: giftrequests.user.name,
            email: giftrequests.user.email,
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const body = await req.json();

  const validatedData = GiftRequestSchema.parse(body);

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

  if (!toy.forGifts) {
    return NextResponse.json(
      { success: false, error: t("ToyNotGift") },
      { status: 404 }
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
        userId: userId,
        toyId: toy.id,
        forGifts: validatedData.forGifts,
        forChanges: validatedData.forChanges,
        statusId: statusAvailable.id,
        exchangeToyId: null,
      },
    });

    return NextResponse.json({ data: giftrequests }, { status: 201 });
  } catch {
    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
