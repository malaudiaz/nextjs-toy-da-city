// app/api/status/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import prisma from "@/lib/prisma";
import { CommentsSchema } from "@/lib/schemas/comments";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { CommentsUpdateSchema } from "@/lib/schemas/comments";
import { auth } from "@clerk/nextjs/server";

// Obtener un commentario por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Comments.errors");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  try {
    const comments = await prisma.toyComments.findUnique({
      where: { id: String(id) },
    });

    if (!comments) {
      return NextResponse.json({ error: "Comments not found" }, { status: 404 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Comments.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Validar ID
    if (!id) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = CommentsSchema.parse(body);

    // Actualizar estado
    const updatedComments = await prisma.toyComments.update({
      where: { id: String(id) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedComments }, { status: 200 });
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
  const t = await getTranslations("Comments.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id ) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.toyComments.delete({
      where: { id: String(id), isActive: false },
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

  const t = await getTranslations("Comments.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Obtener y validar ID
    if (!id ) {
      return NextResponse.json(
        { error: t("Invalid Comments ID") },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = CommentsUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedComments = await prisma.toyComments.update({
      where: { id: String(id) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedComments, { status: 200 });
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
          { error: "Comentario no encontrado" },
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
