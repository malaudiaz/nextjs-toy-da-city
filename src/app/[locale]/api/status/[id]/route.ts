// app/api/status/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { StatusSchema } from "@/lib/schemas/status";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { StatusUpdateSchema } from "@/lib/schemas/status";

// Obtener un estado por ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    try {
      const status = await prisma.status.findUnique({
        where: { id: params.id },
      })
  
      if (!status) {
        return NextResponse.json(
          { error: 'Status not found' },
          { status: 404 }
        )
      }
  
      return NextResponse.json(status)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch status' },
        { status: 500 }
      )
    }
  }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const statusId = params.id;

  const t = await getTranslations("Status.errors");

  try {
    // Validar ID
    if (!statusId || isNaN(Number(statusId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await request.json();
    const validatedData = StatusSchema.parse(body);

    // Actualizar estadi
    const updatedStatus = await prisma.status.update({
      where: { id: Number(statusId) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedStatus }, { status: 200 });
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

export async function DEACTIVATE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Status.errors");
  const statusId = params.id;

  try {
    if (!statusId || isNaN(Number(statusId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.status.update({
      where: { id: Number(statusId) },
      data: {
        isActive: false,
        userId: userId
      }
    })
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Status.errors");
  const statusId = params.id;

  try {
    if (!statusId || isNaN(Number(statusId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.status.delete({
      where: { id: Number(statusId) },
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
    const statusId = params.id;
    if (!statusId || isNaN(Number(statusId))) {
      return NextResponse.json(
        { error: "ID de estado inválido" },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await request.json();
    
    // 3. Validación parcial (schema diferente al POST)
    const validatedData = StatusUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedStatus = await prisma.status.update({
      where: { id: Number(statusId) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedStatus, { status: 200 });

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
          { error: "Estado no encontrado" },
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