// app/api/toy/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ToySchema } from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { deleteUploadedFile, handleFileUpload } from "@/lib/fileUtils";
import { auth } from "@clerk/nextjs/server";

const MAX_MEDIA_FILES = 6;

// Obtener un juguete por ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const t = await getTranslations("Toy");
  const g = await getTranslations("General");

  let { userId } = await auth();

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

  const { id, locale } = await params;

  const userLanguageCode = locale;

  try {
    const toy = await prisma.toy.findUnique({
      where: { id: id, isActive: true },
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
    });

    if (!toy) {
      return NextResponse.json({ error: t("NotFound") }, { status: 404 });
    }

    // Verificar si el usuario actual tiene este toy como favorito
    let favorite;

    if (userId) {
      favorite = await prisma.favoriteToy.findFirst({
        where: {
          userId: userId,
          toyId: id,
          isActive: true,
        },
      });
    }

    const { category, condition, status, ...toyData } = toy;
    // Formateamos el resultado final
    const toyWithLikeStatus = {
      ...toyData,
      categoryName: category.name,
      categoryDescription: category.translations[0]?.value || category.name,
      conditionName: condition.name,
      conditionDescription: condition.translations[0]?.value || condition.name,
      statusName: status.name,
      statusDescription: status.translations[0]?.value || status.name,
      isFavorite: !!favorite, // true si existe, false si no
      likes: undefined, // Eliminamos el array de likes (no necesario en la respuesta)
    };

    return NextResponse.json(toyWithLikeStatus);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: t("UpdateError") },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Toy");
  const g = await getTranslations("General");

  const { id } = await params;

  let { userId } = await auth();

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

  if (!userId) {
    return NextResponse.json(
      { success: false, error: g("Unauthorized") },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const stringforSell = formData.get("forSale") || "false";
    const stringforGifts = formData.get("forGift") || "false";
    const stringforChanges = formData.get("forChange") || "false";

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
    const newFiles = formData.getAll("newFiles") as File[];
    const mediaToDelete = formData.getAll("deleteMedia") as string[]; // IDs de medios a eliminar

    // 3. Obtener juguete actual para validación
    const currentToy = await prisma.toy.findUnique({
      where: { id: id },
      include: { media: true },
    });

    if (!currentToy) {
      return NextResponse.json(
        { error: t("NotFound") },
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
      // Procesar eliminación de medios
      const mediaToDelete = formData.getAll("deleteMedia") as string[];

      // Filtrar solo IDs válidos
      const validMediaToDelete = mediaToDelete.filter(
        (id): id is string => typeof id === "string" && id.trim() !== ""
      );

      if (validMediaToDelete.length > 0) {
        // Obtener registros para borrar físicamente los archivos
        const mediaToRemove = await tx.media.findMany({
          where: { id: { in: validMediaToDelete } },
          select: { fileUrl: true, id: true }, // Solo lo necesario
        });

        // Eliminar de la base de datos
        await tx.media.deleteMany({
          where: { id: { in: validMediaToDelete } },
        });

        // Eliminar archivos físicos
        await Promise.all(
          mediaToRemove.map((media) => deleteUploadedFile(media.fileUrl))
        );
      }

      // Subir nuevos archivos
      const newFiles = formData.getAll("newFiles") as File[];
      const newMedia: Prisma.MediaCreateWithoutToyInput[] = await Promise.all(
        newFiles.map(async (file) => ({
          fileUrl: await handleFileUpload(file),
          type: file.type.startsWith("image") ? "IMAGE" : ("VIDEO" as const),
        }))
      );

      // IDs de imágenes existentes que se mantienen
      const existingImageIds = (
        formData.getAll("existingImageIds") as string[]
      ).filter(
        (id): id is string => typeof id === "string" && id.trim() !== ""
      );

      try {
        // Actualizar juguete
        await tx.toy.update({
          where: { id: id },
          data: {
            ...toyData,
            media: {
              connect: existingImageIds.map((id) => ({ id })),
              create: newMedia,
            },
          },
          include: { media: true },
        });
      } catch (error) {
        console.log("Error:", error);
      }

    });

    return NextResponse.json({
      success: true,
      data: updatedToy,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: g("ValidationsError"),
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

    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}

// Este debe ser para cambiar el estdo del juguete... ver para cuales puede pasar.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Toy.");
  const g = await getTranslations("General");
  
  let { userId } = await auth();

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

  if (!userId) {
    return NextResponse.json(
      { success: false, error: g("Unauthorized") },
      { status: 401 }
    );
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Encontrar todos los juguetes inactivos
    const inactiveToys = await prisma.toy.findMany({
      where: { id: id },
      include: { media: true },
    });

    if (inactiveToys.length === 0) {
      return NextResponse.json({
        success: true,
        message: t("NotExistToyInactive"),
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
        error: t("DeleteError"),
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
