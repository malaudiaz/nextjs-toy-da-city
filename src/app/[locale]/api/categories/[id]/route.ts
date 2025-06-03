// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { CategorySchema } from "@/lib/schemas/category";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { CategoryUpdateSchema } from "@/lib/schemas/category";
import { getAuthUserFromRequest } from "@/lib/auth";

// Obtener un estado por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const { id } = params; // Safe to use

  try {
    const status = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!status) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Categories.errors");

  const { id } = params; // Safe to use

  try {
    // Validar ID
    if (!params.id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: t("InvalidCategoryID") },
        { status: 400 }
      );
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = CategorySchema.parse(body);

    // Actualizar categoría
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Categories.errors");

  const { id } = params; // Safe to use

  try {
    if (!params.id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: t("InvalidCategoryId") },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: Number(id), isActive: false },
    });

    return NextResponse.json(
      { message: t("Deleted Category Successfully") },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Categories.errors");

  const { id } = params; // Safe to use

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: t("InvalidCategoryId") },
      { status: 400 }
    );
  }

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = CategoryUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    // Manejo de errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Error de validación",
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
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
