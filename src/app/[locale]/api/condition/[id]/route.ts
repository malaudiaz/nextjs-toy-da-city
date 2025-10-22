// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ConditionSchema } from "@/lib/schemas/condition";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { ConditionUpdateSchema } from "@/lib/schemas/condition";
import { auth } from "@clerk/nextjs/server";


// Obtener una condicion por su ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Condition.errors");
  const g = await getTranslations("General.errors");

  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");

    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const { id } = await params;

  try {
    const condition = await prisma.condition.findUnique({
      where: { id: Number(id) },
    });

    if (!condition) {
      return NextResponse.json({ error: t("NotFound") }, { status: 404 });
    }

    return NextResponse.json(condition);
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
  const t = await getTranslations("Condition.errors");
  const g = await getTranslations("General.errors");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // Validar ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: t("InvalidId") },
        { status: 400 }
      );
    }

    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = ConditionSchema.parse(body);

    // Actualizar condition
    const updatedCondition = await prisma.condition.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedCondition }, { status: 200 });
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
  const t = await getTranslations("Condition.errors");
  const g = await getTranslations("General.errors");


  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: t("InvalidId") },
        { status: 400 }
      );
    }

    await prisma.condition.delete({
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
  const t = await getTranslations("Condition.errors");
  const g = await getTranslations("General.errors");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: t("InvalidId") },
      { status: 400 }
    );
  }

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = ConditionUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedCondition = await prisma.condition.update({
      where: { id: Number(id) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedCondition, { status: 200 });
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
