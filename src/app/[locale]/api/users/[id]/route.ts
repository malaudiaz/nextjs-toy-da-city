// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import prisma from "@/lib/prisma";
import { UserSchema } from "@/lib/schemas/user";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { UserUpdateSchema } from "@/lib/schemas/user";
import { auth } from "@clerk/nextjs/server";

// Obtener un usuario por su ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("User.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("User.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: t("InvaliduserID") },
        { status: 400 }
      );
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = UserSchema.parse(body);

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedUser }, { status: 200 });
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
  const t = await getTranslations("User.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id) {
      return NextResponse.json(
        { error: t("InvalidUserId") },
        { status: 400 }
      );
    }

    await prisma.user.deleteMany({
      where: { id: String(id), isActive: false },
    });

    return NextResponse.json(
      { message: t("Deleted User Successfully") },
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
  const t = await getTranslations("User.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  if (!id) {
    return NextResponse.json(
      { error: t("InvalidUserId") },
      { status: 400 }
    );
  }

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = UserUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedUser, { status: 200 });
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
          { error: "User no encontrada" },
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
