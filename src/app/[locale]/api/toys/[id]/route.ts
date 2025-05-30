// app/api/toy/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ToySchema, ToyUpdateSchema } from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

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
      const toy = await prisma.toy.findUnique({
        where: { id: params.id },
      })
  
      if (!toy) {
        return NextResponse.json(
          { error: 'Toy not found' },
          { status: 404 }
        )
      }
  
      return NextResponse.json(toy)
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

  const toyId = params.id;

  const t = await getTranslations("Toy.errors");

  try {
    // Validar ID
    if (!toyId || isNaN(Number(toyId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    // Obtener y validar cuerpo
    const body = await request.json();
    const validatedData = ToySchema.parse(body);

    // Actualizar estadi
    const updatedToy = await prisma.toy.update({
      where: { id: Number(toyId) },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedToy }, { status: 200 });
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

// Este debe ser para cambiar el estdo del juguete... ver para cuales puede pasar.
export async function SALE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Toy.errors");
  const toyId = params.id;

  try {
    if (!toyId || isNaN(Number(toyId))) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.toy.update({
      where: { id: Number(toyId) },
      data: {
        //isActive: false,
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Obtener y validar ID
    const toyId = params.id;
    if (!toyId || isNaN(Number(toyId))) {
      return NextResponse.json(
        { error: "ID de juguete inválido" },
        { status: 400 }
      );
    }

    // 2. Parsear cuerpo
    const body = await request.json();
    
    // 3. Validación parcial (schema diferente al POST)
    const validatedData = ToyUpdateSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedToy = await prisma.toy.update({
      where: { id: Number(toyId) },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedToy, { status: 200 });

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
          { error: "Juguete no encontrado" },
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