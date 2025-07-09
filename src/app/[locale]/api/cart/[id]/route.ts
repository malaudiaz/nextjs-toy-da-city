// app/api/status/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Prisma } from "@prisma/client";
import { UpdateCartItemSchema } from "@/lib/schemas/cart";
import { getAuthUserFromRequest } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Cart.errors");

  const { id } = await params; // Safe to use

  try {
    if (!id) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = UpdateCartItemSchema.parse(body);

    const updatedItem = await prisma.cartItem.update({
      where: { id: id, 
               cart: {userId: userId} },
      data: validatedData,
      include: { toy: true }
    });

    return NextResponse.json({ data: updatedItem }, { status: 200 });
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
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Cart.errors");

  const { itemId } = await params; // Safe to use

  try {
    if (!itemId) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId, cart: {userId: userId } },
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
  { params }: { params: Promise<{ itemId: string }> }
) {

  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error }, { status: code });
  }

  const t = await getTranslations("Status.errors");

  const { itemId } = await params; // Safe to use

  try {
    if (!itemId) {
      return NextResponse.json({ error: t("InvalidId") }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = UpdateCartItemSchema.parse(body);

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId, 
               cart: {userId: userId} },
      data: validatedData,
      include: { toy: true }
    });

    return NextResponse.json({ data: updatedItem }, { status: 200 });
  
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
