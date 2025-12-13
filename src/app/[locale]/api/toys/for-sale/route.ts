import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { PaginationSchema} from "@/lib/schemas/toy";

export async function GET(req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  // --- 1. Autenticación ---
  let { userId } = await auth();
  const g = await getTranslations("General");
  const t = await getTranslations("Toy");
 
  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  // --- 2. Verificar que el usuario existe en tu base ---
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  // --- 3. Obtener parámetro de estado (opcional) ---
  const { searchParams } = new URL(req.url);
  let statusName = searchParams.get("status"); // Ej: ?status=sold — puede ser null

  if (!statusName) {
    statusName = 'sold';
  }

  let statusId: number | undefined;

  if (statusName) {
    const existingStatus = await prisma.status.findUnique({
      where: { name: statusName },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: `Status "${statusName}" not found` },
        { status: 400 }
      );
    }
    statusId = existingStatus.id;
  }

  const { locale } = await params;
  const userLanguageCode = locale;
  
  const pagination = PaginationSchema.parse({
        page: parseInt(searchParams.get('page') || "1"),
        limit: parseInt(searchParams.get('limit') || "4")
  });
  
  try {
    // --- 4. Construir filtro dinámico ---
    const where: Prisma.ToyWhereInput = {
      sellerId: user.id,
      forSell: true,
    };

    // Solo agregar statusId si se proporcionó un statusName válido
    if (statusId !== undefined) {
      where.statusId = statusId;
    }

    // --- 5. Consultar juguetes ---
    const query = {
      where,
      include: {
        media: true,
        //category: true,
        category: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        //condition: true,
        condition: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        // status: true,
        status: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        seller: { // Asegúrate de incluir el seller
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            order: {
              include: {
                buyer: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
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
            isActive: undefined,
            userId: undefined
          }})
    
    if (!processedToys) {
      return NextResponse.json({ error: t("ToyNotFound") }, { status: 404 });
    }

    // --- 6. Respuesta ---
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

      //  return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("Error fetching toys for sale:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}