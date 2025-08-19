// app/api/toy/[id]/ralated.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ToySchema } from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { deleteUploadedFile, handleFileUpload } from "@/lib/fileUtils";
import { getAuthUserFromRequest } from "@/lib/auth";

const MAX_MEDIA_FILES = 6;

// Obtener juguetes de categoria similar al juguete seleccionado

async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string, locale: string }> }
    // { params }: { params: Promise<{ id: string, locale: string, limit: number }> }
  ) {
  
    // const { id, limit, locale } = await params;
    const { id, locale } = await params;
  
    const userLanguageCode = locale
  
    // const { userId } = await getAuthUserFromRequest(req);
    const userId = 'user_2wY8ZRoOrheojD7zQXtwk9fg00x'
    const limit = 4
    const t = await getTranslations("Toy.errors");
  
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
        forSell: true
      }
    });
  
    // 3. Calcular el límite real (no más del total disponible)
    const take = Math.min(limit, totalToys);
    if (take === 0) return [];
  
    // 4. Obtener IDs aleatorios usando técnica de offset
    const randomSkip = Math.floor(Math.random() * totalToys);
  
    // 5. Obtener los juguetes relacionados
    const relatedToys = await prisma.toy.findMany({
      where: {
        categoryId: currentToy.categoryId,
        id: { not: id },
        isActive: true,
        forSell: true
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
      take: take,
      orderBy: {
        createdAt: 'desc'
      }
    });
  
    // 6. Si no hay suficientes resultados, obtener los más recientes como fallback
    // if (relatedToys.length < take) {
    //   const additionalToys = await prisma.toy.findMany({
    //     where: {
    //       categoryId: currentToy.categoryId,
    //       id: { 
    //         not: {
    //           in: [id, ...relatedToys.map(t => t.id)]
    //         }
    //       },
    //       isActive: true,
    //       forSell: true
    //     },
    //     include: {
    //       media: {
    //         take: 1,
    //         select: {
    //           fileUrl: true
    //         }
    //       },
    //     },
    //     take: take - relatedToys.length,
    //     orderBy: {
    //       createdAt: 'desc'
    //     }
    //   });
  
    //   relatedToys.push(...additionalToys);
    // }
  
    return relatedToys;
  }
