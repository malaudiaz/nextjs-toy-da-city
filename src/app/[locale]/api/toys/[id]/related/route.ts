// app/api/toy/[id]/ralated.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
//import { getAuthUserFromRequest } from "@/lib/auth";
import { PaginationSchema} from "@/lib/schemas/toy";

// Obtener juguetes de categoria similar al juguete seleccionado
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
  ) {
  
    const { searchParams } = new URL(req.url!)
    const { id, locale } = await params;

    const t = await getTranslations("Toy.errors");

    const userLanguageCode = locale

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    //const { userId } = await getAuthUserFromRequest(req);
    // const userId = 'user_2wY8ZRoOrheojD7zQXtwk9fg00x'

    try {
      
      // 1. Obtener la categoría del juguete actual
      const currentToy = await prisma.toy.findUnique({
        where: { id: id },
        select: { categoryId: true }
      });
    
      if (!currentToy) {
        throw new Error('Juguete no encontrado');
      }
    
      // 2. Contar total de juguetes disponibles en la misma categoría
      const totalToys = await prisma.toy.count({
        where: {
          categoryId: currentToy.categoryId,
          id: { not: id }, // Excluir el juguete actual
          isActive: true,
          //forSell: true
        }
      });
  
      // 3. Calcular el límite real (no más del total disponible)
      //const take = Math.min(pagination.limit, totalToys);
      //if (take === 0) return [];
    
      // 4. Obtener IDs aleatorios usando técnica de offset
      const randomSkip = Math.floor(Math.random() * totalToys);
  
      // 5. Obtener los juguetes relacionados
      const relatedToys = await prisma.toy.findMany({
        where: {
          categoryId: currentToy.categoryId,
          id: { not: id },
          isActive: true,
          //forSell: true
        },
        include: {
          media: {
            take: 1,
            select: {
              fileUrl: true
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
          seller: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip: randomSkip,
        //take: take,
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      // 6. Si no hay suficientes resultados, obtener los más recientes como fallback
      //if (relatedToys.length < take) {
        const additionalToys = await prisma.toy.findMany({
          where: {
            categoryId: currentToy.categoryId,
            id: { 
              not: {
                in: [id, ...relatedToys.map(t => t.id)]
              }
            },
            isActive: true,
            //forSell: true
          },
          include: {
            media: {
              take: 1,
              select: {
                fileUrl: true
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
            seller: {
              select: {
                id: true,
                name: true
              }
            }
          },
          //take: take - relatedToys.length,
          orderBy: {
            createdAt: 'desc'
          }
        });
    
        relatedToys.push(...additionalToys);
      //}
  
      const processedToys = relatedToys
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
           
          })
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
      }
  }
