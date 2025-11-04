// app/api/status/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { StatusSchema } from "@/lib/schemas/status";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { StatusUpdateSchema } from "@/lib/schemas/status";
import { auth } from "@clerk/nextjs/server";

// Obtener un estado por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Status");
  const g = await getTranslations("General");

  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");

    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const { id } = await params; // Safe to use

  try {
    const status = await prisma.status.findUnique({
      where: { id: Number(id) },
    });

    if (!status) {
      return NextResponse.json({ error: t("NotFound") }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Status");
  const g = await getTranslations("General");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // Validar ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = StatusSchema.parse(body);

    // Actualizar estado
    const updatedStatus = await prisma.status.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedStatus }, { status: 200 });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Status");
  const g = await getTranslations("General");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.status.delete({
      where: { id: Number(id), isActive: false },
    });

    return NextResponse.json(
      { message: g("DeletedSuccessfully") },
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

    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const t = await getTranslations("Status");
  const g = await getTranslations("General");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Obtener y validar ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: t("InvalidId") },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = StatusUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedStatus = await prisma.status.update({
      where: { id: Number(id) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedStatus, { status: 200 });
  } catch (error) {
    // Manejo de errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: g("ValidationsError"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: t("NotFound") }, { status: 404 });
      }
    }

    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
