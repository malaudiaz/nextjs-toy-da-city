
// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { CategorySchema } from "@/lib/schemas/category";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { CategoryUpdateSchema } from "@/lib/schemas/category";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  //const { id: categoryId } = await params;
  const categoryId = params.id;

  const t = await getTranslations("Categories.errors");

  try {
    // Validar ID
    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await request.json();
    const validatedData = CategorySchema.parse(body);

    // Actualizar categoría
    const updatedCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedCategory }, { status: 200 });
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const t = await getTranslations("Categories.errors");
  const categoryId = params.id;

  try {
    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: Number(categoryId) },
    });

    return NextResponse.json(
      { message: t("DeletedSuccessfully") },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores con PrismaClientKnownRequestError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // ¡Ahora funciona!
      if (error.code === "P2025") {
        return NextResponse.json({ error: t("NotFound") }, { status: 404 });
      }
    }

    return NextResponse.json({ error: t("ServerError") }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Obtener y validar ID
    const categoryId = params.id;
    if (!categoryId || isNaN(Number(categoryId))) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await request.json();
    
    // 3. Validación parcial (schema diferente al POST)
    const validatedData = CategoryUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedCategory, { status: 200 });

  } catch (error) {
    // Manejo de errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Error de validación",
          details: error.errors.map(e => `${e.path}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Categoría no encontrada" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}