import prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET all toys en venta, con paginación y búsqueda
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ locale: string }> }
  ) {
    
    const { success, userId, error, code } = await getAuthUserFromRequest(request);
   
    if (!success && !userId) {
        return NextResponse.json({success: success, error: error}, { status: code }) 
    }

     // const { success, error, code } = await getAuthUserFromRequest(request);
    // const userId = 'user_2xMoqaxDWhsUmKjITZbWHRJMo8Z'

    const { locale } = await params;
  
    const t = await getTranslations("Toy.errors");

    try {
      const { searchParams } = new URL(request.url!)
  
      const userLanguageCode = locale
  
      const pagination = PaginationSchema.parse({
        page: parseInt(searchParams.get('page') || "1"),
        limit: parseInt(searchParams.get('limit') || "10")
      });
  
      const statusAvailable = await prisma.status.findUnique({ where: { name: "available" } })
        if (!statusAvailable) {
        return NextResponse.json({success: false, error: `StatusNotFound.` }, { status: 400 } )}

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
                in: ["available", "reserved"] // Filtra por estos estados
              }
            },
            transactions: { // Juguetes que NO tienen transacciones completadas
              none: {
                statusId: statusAvailable.id
              }
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
                type: true
              }
            },
            category: {
                include: {
                    translations: {
                    where: {languageId: userLanguageCode, key: 'name'},
                    select: {value: true}
                    }
                }  
                }, 
            condition: {
                include: {
                    translations: {
                    where: {languageId: userLanguageCode, key: 'name' },
                    select: {value: true}
                    }
                }  
                }, 
            status: {
                include: {
                    translations: {
                    where: {languageId: userLanguageCode, key: 'name'},
                    select: {value: true}
                    }
                }  
                }, 
          }
        }),
        prisma.toy.count({
            where: { sellerId: userId } 
            })
        ]);

      
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
      
      return NextResponse.json({
        success: true,
        data: processedToys, //filteredToys,
        pagination: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / pagination.limit),
          currentPage: pagination.page,
          perPage: pagination.limit
        }
      })
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
    }
  }
  
export async function POST(req: Request) {
  const { success, userId: buyerId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !buyerId ) {
    return NextResponse.json(
        { 
          success: success, 
          error: error 
        },
        { status: code }
      )    
  }

  const user = await prisma.user.findUnique({ where: { clerkId: buyerId } });
  if (!user) {
    return NextResponse.json(
      { 
        success: false, 
        error: "User not found" 
      },
      { status: 404 }
    )
  }

  const t = await getTranslations("Transaction.errors");

  try {
    const { toyIds } = await req.json(); // Ejemplo: { toyIds: ["uuid1", "uuid2"] }

    const paymentMethod = "STRIPE" 

    if (!toyIds || !Array.isArray(toyIds)) {
      return NextResponse.json(
        { error: t("ToyIdsRequired") },
        { status: 400 }
      );
    }

    // 1. Verificar que los juguetes existen y están disponibles para venta
    const toys = await prisma.toy.findMany({
      where: {
        id: { in: toyIds },
        forSell: true, // Solo juguetes marcados como "en venta"
        isActive: true, // Solo juguetes activos
        status: {
          name: { in: ["Available", "Reserved"] } // Filtra por status permitidos
        }
      },
      include: {
        seller: true, // Necesario para obtener el sellerId
        status: true, // Validar que el estado permita la venta
      },
    });

    if (toys.length !== toyIds.length) {
      const missingIds = toyIds.filter(id => !toys.some(toy => toy.id === id));
      return NextResponse.json(
        { error: t("SomeToysNotAvailable"), details: missingIds },
        { status: 404 }
      );
    }

    // 2. Crear transacciones y marcar juguetes como vendidos (en una transacción)
    const result = await prisma.$transaction(async (tx) => {
      const soldStatus = await tx.status.findUnique({
        where: { name: "Sold" },
        select: { id: true }
      });
    
      if (!soldStatus) {
        throw new Error("Estado SOLD no encontrado en la base de datos");
      }

      // Actualizar juguetes (marcar como no disponibles)
      await tx.toy.updateMany({
        where: { id: { in: toyIds } },
        data: { 
          forSell: false,
          isActive: false, // Opcional: desactivar el juguete después de la venta
          statusId: soldStatus.id // Cambiar estado a SOLD
        },
      });

      // Crear transacciones (una por juguete)
      const transactions = await Promise.all(
        toys.map((toy) =>
          tx.transaction.create({
            data: {
              toyId: toy.id,
              buyerId: buyerId!,
              sellerId: toy.sellerId, // Obtenido del juguete
              price: toy.price,
              statusId: toy.status.id, // Estado actual del juguete (o un ID fijo para "completado")
              paymentMethod,
              wasSold: true, // Marcamos como venta (no intercambio/regalo)
            },
          })
        )
      );

      return transactions;
    });

    return NextResponse.json(
      { data: result, message: t("SaleCompleted") },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en /api/toys/sales:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: t("DuplicateTransaction") },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: t("SaleFailed") },
      { status: 500 }
    );
  }
}