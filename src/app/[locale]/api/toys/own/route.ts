import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { Prisma } from '@prisma/client';
import { PaginationSchema, ToyFilterSchema} from "@/lib/schemas/toy";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  let { userId } = await auth();
  const g = await getTranslations("General");

  if (!userId) {
    userId = req.headers.get("X-User-ID");
  }

  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: g("UserNotFound"),
        },
        { status: 404 }
      );
    } else {
      userId = user.id;
    }
  }

  const { locale } = await params;
  const userLanguageCode = locale;
  const t = await getTranslations("Toy");
  const { searchParams } = new URL(req.url!)
  const pagination = PaginationSchema.parse({
        page: parseInt(searchParams.get('page') || "1"),
        limit: parseInt(searchParams.get('limit') || "4")
      });
  const filters = ToyFilterSchema.parse({
        statusId: searchParams.get('statusId') ? Number(searchParams.get('statusId')) : undefined
      })
    
  const where: Prisma.ToyWhereInput = {};

  const andSeller: Prisma.ToyWhereInput[] = [
    { sellerId: userId! }, 
    { isActive: true }
  ];
  
  if (filters.statusId) where.statusId = filters.statusId;

  where.AND = [
    ...andSeller,
    { ...where } 
  ].filter(Boolean); // Eliminar posibles entradas vacías


  try {
    const query = {
      where: where, 
      include: {
        media: true,
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
      orderBy: {
        createdAt: "desc" as const, // El "as const" ayuda con la inferencia de tipos
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    };

    // Ejecutar consulta
    const [toys, totalCount] = await Promise.all([
      prisma.toy.findMany(query),
      prisma.toy.count({ where })
    ])
    
    const processedToys = toys
    .map(toy => {
      const {category, condition, status, ...toyData } = toy
      return {
        ...toyData,
        categoryName: category.name,
        categoryDescription: category.translations[0]?.value || category.name,
        conditionName: condition.name,
        conditionDescription: condition.translations[0]?.value || condition.name,
        statusName: status.name,
        statusDescription: status.translations[0]?.value || status.name,
        // Opcional: eliminar relaciones innecesarias
        translations: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        isActive: toyData.isActive,
        userId: undefined
      }})

    if (!processedToys) {
      return NextResponse.json({ error: t("ToyNotFound") }, { status: 404 });
    }
  
    return NextResponse.json({
      success: true,
      data: processedToys, 
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        currentPage: pagination.page,
        perPage: pagination.limit
      }
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}
