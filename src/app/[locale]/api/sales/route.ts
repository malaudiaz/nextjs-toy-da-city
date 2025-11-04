import prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { createSale } from "@/lib/sales";

// GET all toys en venta, con paginación y búsqueda
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {

  const g = await getTranslations("General");
  const s = await getTranslations("Status");

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
        { success: false, error: s("NotFound")},
        { status: 400 }
      );
    }

    const [toys, totalCount] = await Promise.all([
      prisma.toy.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {
          sellerId: userId,
          isActive: true,
          forSell: true,
          status: {
            name: {
              in: ["available", "reserved"], // Filtra por estos estados
            },
          }
        },
        select: {
          id: true,
          title: true,
          price: true,
          media: {
            take: 1, // Solo la primera imagen
            select: {
              fileUrl: true,
              type: true,
            },
          },
          category: {
            include: {
              translations: {
                where: { languageId: userLanguageCode, key: "name" },
                select: { value: true },
              },
            },
          },
          condition: {
            include: {
              translations: {
                where: { languageId: userLanguageCode, key: "name" },
                select: { value: true },
              },
            },
          },
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
      prisma.toy.count({
        where: { sellerId: userId },
      }),
    ]);

    const processedToys = toys.map((toy) => {
      const { category, condition, status, ...toyData } = toy;
      return {
        ...toyData,
        categoryName: category.name,
        categoryDescription: category.translations[0]?.value || category.name,
        conditionName: condition.name,
        conditionDescription:
          condition.translations[0]?.value || condition.name,
        statusName: status.name,
        statusDescription: status.translations[0]?.value || status.name,
        // Opcional: eliminar relaciones innecesarias
        translations: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        isActive: undefined,
        userId: undefined,
      };
    });

    return NextResponse.json({
      success: true,
      data: processedToys, //filteredToys,
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

export async function POST(req: Request) {
  const { userId: buyerId } = await auth();

  const g = await getTranslations("General");
  
  if (!buyerId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const body = await req.json();
  const toyIds = body.toyIds;

  const user = await prisma.user.findUnique({ where: { clerkId: buyerId } });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: g("UserNotFound"),
      },
      { status: 404 }
    );
  }

  try {
    const result = await createSale(toyIds);
    return NextResponse.json(
      { data: result, message: "Sale completed" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
