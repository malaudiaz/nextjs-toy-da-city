// app/api/status/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { FavoriteToySchema } from "@/lib/schemas/favoritetoy";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

// Obtener un favorito por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    const favorite_toy = await prisma.favoriteToy.findUnique({
      where: { id: id },
    });

    if (!favorite_toy) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    return NextResponse.json(favorite_toy);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Favorites.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = FavoriteToySchema.parse(body);

    const updatedFavoriteToy = await prisma.favoriteToy.update({
      where: { id: id },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedFavoriteToy }, { status: 200 });
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Favorites.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id ) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.favoriteToy.delete({
      where: { id: id, isActive: false },
    });

    return NextResponse.json(
      { message: t("DeletedSuccessfully") },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: t("NotFound") }, { status: 404 });
      }
    }

    return NextResponse.json({ error: t("ServerError") }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const t = await getTranslations("Favorites.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Obtener y validar ID
    if (!id ) {
      return NextResponse.json(
        { error: t("Invalid Favorite ID") },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = FavoriteToySchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedFavoriteToy = await prisma.favoriteToy.update({
      where: { id: id },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedFavoriteToy, { status: 200 });
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
          { error: "Likes no encontrado" },
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
