// app/api/status/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { LikesToySchema } from "@/lib/schemas/likestoy";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { getAuthUserFromRequest } from "@/lib/auth";

// Obtener un like por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const { id } = await params; // Safe to use

  try {
    const toy_likes = await prisma.toyLikes.findUnique({
      where: { id: id },
    });

    if (!toy_likes) {
      return NextResponse.json({ error: "Likes not found" }, { status: 404 });
    }

    return NextResponse.json(toy_likes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Likes.errors");

  const { id } = await params; // Safe to use

  try {
    // Validar ID
    if (!id) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = LikesToySchema.parse(body);

    // Actualizar likes
    const updatedLikesToy = await prisma.toyLikes.update({
      where: { id: id },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedLikesToy }, { status: 200 });
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
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Likes.errors");

  const { id } = await params; // Safe to use

  try {
    if (!id ) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.toyLikes.delete({
      where: { id: id, isActive: false },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Likes.errors");

  const { id } = await params; // Safe to use

  try {
    // 1. Obtener y validar ID
    if (!id ) {
      return NextResponse.json(
        { error: t("Invalid Likes ID") },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = LikesToySchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedtoyLikes = await prisma.toyLikes.update({
      where: { id: id },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedtoyLikes, { status: 200 });
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
