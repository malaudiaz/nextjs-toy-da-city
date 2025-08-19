// app/api/toy/[id]/route.ts
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

// Obtener un juguete por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params;

  const userLanguageCode = locale

  const { userId } = await getAuthUserFromRequest(req);

  const t = await getTranslations("Toy.errors");

  // const userId = 'user_2wY8ZRoOrheojD7zQXtwk9fg00x'
  try {
    const toy = await prisma.toy.findUnique({
      where: { id: id, isActive: true },
      include: {
        media: true,
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
        comments: {
          where: { isActive: true },
          select: {
            // Selecciona solo los campos necesarios
            id: true,
            summary: true,
            userId: true,
          },
          take: 4, // Límite de 4 comentarios
          skip: 0, // Opcional: Saltar los primeros X (útil para paginación)
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: {
              where: { isActive: true }, // Filtra solo comentarios activos
            },
          },
        },
        // Subconsulta condicional: solo si hay un usuario logueado
        ...(userId ? {
          likes: {
            where: { userId: userId },
            select: { id: true },
            take: 1,
          },
        } : {}),
      },
    });

    if (!toy) {
      return NextResponse.json({ error: t("ToyNotFound") }, { status: 404 });
    }

    // Determina si el usuario dio like (solo si existe UserId)
    //const isLikedByUser = userId ? toy.likes?.length > 0 : false;

    const {category, condition, status, ...toyData } = toy
    // Formateamos el resultado final
    const toyWithLikeStatus = {
      ...toyData,
      categoryName: category.name,
      categoryDescription: category.translations[0]?.value || category.name,
      conditionName: condition.name,
      conditionDescription: condition.translations[0]?.value || condition.name,
      statusName: status.name,
      statusDescription: status.translations[0]?.value || status.name,
      likes: undefined, // Eliminamos el array de likes (no necesario en la respuesta)
    };

    return NextResponse.json(toyWithLikeStatus);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json(
      {
        success: success,
        error: error,
      },
      { status: code }
    );
  }

  const t = await getTranslations("Toy.errors");

  try {
    const formData = await req.formData();

    const stringforSell = formData.get("forSell") || "false";
    const stringforGifts = formData.get("forGifts") || "false";
    const stringforChanges = formData.get("forChanges") || "false";
    
    // Validar con Zod
    const toyData = ToySchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      price: Number(formData.get("price")),
      categoryId: Number(formData.get("categoryId")),
      conditionId: Number(formData.get("conditionId")),
      forSell: stringforSell === "true",
      forGifts: stringforGifts === "true",
      forChanges: stringforChanges === "true",
    });

    // 2. Procesar archivos nuevos
    const newFiles = formData.getAll("newMedia") as File[];
    const mediaToDelete = formData.getAll("deleteMedia") as string[]; // IDs de medios a eliminar

    // 3. Obtener juguete actual para validación
    const currentToy = await prisma.toy.findUnique({
      where: { id: id },
      include: { media: true },
    });

    if (!currentToy) {
      return NextResponse.json(
        { error: "Juguete no encontrado" },
        { status: 404 }
      );
    }

    // 4. Validar límite de archivos (existentes + nuevos - eliminados)
    const currentMediaCount = currentToy.media.length;
    const finalMediaCount =
      currentMediaCount + newFiles.length - mediaToDelete.length;

    if (finalMediaCount > MAX_MEDIA_FILES) {
      throw new Error(`Excediste el límite de ${MAX_MEDIA_FILES} archivos`);
    }

    // 5. Transacción para actualización atómica
    const updatedToy = await prisma.$transaction(async (tx) => {
      // Eliminar medios solicitados
      if (mediaToDelete.length > 0) {
        // Obtener URLs antes de eliminar para borrar físicamente
        const mediaToRemove = await tx.media.findMany({
          where: { id: { in: mediaToDelete } },
        });

        await tx.media.deleteMany({
          where: { id: { in: mediaToDelete } },
        });

        // Eliminar archivos físicos
        await Promise.all(
          mediaToRemove.map((media) => deleteUploadedFile(media.fileUrl))
        );
      }

      // Subir nuevos archivos
      const newMedia: Prisma.MediaCreateWithoutToyInput[] = await Promise.all(
        newFiles.map(async (file) => ({
          fileUrl: await handleFileUpload(file),
          type: file.type.startsWith("image") ? "IMAGE" : ("VIDEO" as const),
        }))
      );

      // Actualizar juguete
      // const userId = 'user_2wY8ZRoOrheojD7zQXtwk9fg00x'
      return await tx.toy.update({
        where: { id: id },
        data: {
          ...toyData,
          media: {
            create: newMedia,
          },
        },
        include: { media: true },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedToy,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: t("ValidationsErrors"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Manejar errores de Prisma (ej: registro no encontrado)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: t("NotFound") }, { status: 404 });
    }

    return NextResponse.json({ error: t("ServerError") }, { status: 500 });
  }
}

// Este debe ser para cambiar el estdo del juguete... ver para cuales puede pasar.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json(
      {
        success: success,
        error: error,
      },
      { status: code }
    );
  }

  const t = await getTranslations("Toy.errors");
  const { id } = await params; // Safe to use

  try {
    // 1. Encontrar todos los juguetes inactivos
    const inactiveToys = await prisma.toy.findMany({
      where: { id: id, isActive: false },
      include: { media: true },
    });

    if (inactiveToys.length === 0) {
      return NextResponse.json({
        success: true,
        message: t("No hay juguetes inactivos para eliminar"),
      });
    }

    // 2. Eliminar archivos físicos y registros de la base de datos
    const deletionResults = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const toy of inactiveToys) {
        // Eliminar archivos físicos
        await Promise.all(
          toy.media.map(async (media) => {
            await deleteUploadedFile(media.fileUrl);
          })
        );

        // Eliminar registros de medios
        await tx.media.deleteMany({
          where: { toyId: toy.id },
        });

        // Eliminar juguete
        const deletedToy = await tx.toy.delete({
          where: { id: toy.id },
        });

        results.push({
          id: deletedToy.id,
          description: deletedToy.description,
          mediaCount: toy.media.length,
        });
      }

      return results;
    });

    return NextResponse.json({
      success: true,
      deletedCount: deletionResults.length,
      deletedToys: deletionResults,
      message: `${deletionResults.length} juguetes inactivos y sus medios asociados fueron eliminados`,
    });
  } catch (error) {
    console.error("Error en limpieza:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar juguetes inactivos",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
