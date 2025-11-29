
import prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/schemas/request";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET all giftrequests para regalar con paginación y búsqueda de un usuario logueado
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const g = await getTranslations("General");
  const t = await getTranslations("Toy");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { locale } = await params;

  try {
    const { searchParams } = new URL(request.url!);

    const userLanguageCode = locale;

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    });

    const statusAvailable = await prisma.status.findUnique({
      where: { name: "available" },
    });
    if (!statusAvailable) {
      return NextResponse.json(
        { success: false, error: t("NotFound") },
        { status: 400 }
      );
    }

    const [giftrequests, totalCount] = await Promise.all([
      prisma.giftRequest.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {
          userId: userId,
          forGifts: true,
          status: {
            name: {
              in: ["available", "reserved"], // Filtra por estos estados
            },
          }
        },
        select: {
          id: true,
          status: {
            include: {
              translations: {
                where: { languageId: userLanguageCode, key: "name" },
                select: { value: true },
              },
            },
          },
        },
      }),
      prisma.giftRequest.count({
        where: { userId: userId },
      }),
    ]);

    const giftRequestsProcess = giftrequests.map((giftRequest) => {
      const { status, ...giftrequestData } = giftRequest;

      return {
        ...giftrequestData,
        statusName: status.name,
        statusDescription: status.translations[0]?.value || status.name,
        // Opcional: eliminar relaciones innecesarias
        translations: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        userId: undefined,
      };
    });

    return NextResponse.json({
      success: true,
      data: giftRequestsProcess, 
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        currentPage: pagination.page,
        perPage: pagination.limit,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("InvalidInputParams") }, { status: 400 });
  }
}
