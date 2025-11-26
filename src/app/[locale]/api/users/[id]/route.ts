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
import { clerkClient } from "@clerk/nextjs/server";

export type UserData = {
  id: string; // ID de Prisma (id de la tabla 'users')
  fullName: string;
  imageUrl: string;
  clerkId: string;
  email: string;
  phone: string;
  role: string; // Incluir el rol para la validación/información
  reputation: number;
  reviewsCount: number; // Cantidad total de reseñas recibidas
}

// Obtener un usuario por su ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const g = await getTranslations("General");
  
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");
  }

  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: g("UserNotFound"),
        },
        { status: 404 }
      );
    }
  }

  const { id } = await params;

  try {
    // 1. Buscar usuario en Prisma, obteniendo su clerkId, reputación y rol.
    // También contamos directamente las reseñas recibidas.
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        clerkId: true,
        reputation: true,
        role: true, // Necesitamos el rol para la validación
        reviewsReceived: {
          // Contar las reseñas recibidas
          select: { id: true },
        },
      },
    });

    // 2. Validación de existencia y rol (CORREGIDO: Devuelve error en lugar de null).
    if (!user) {
      console.warn(`Usuario con ID ${id} no encontrado en Prisma.`);
      return NextResponse.json(
        { success: false, error: g("UserNotFound") },
        { status: 404 }
      );
    }

    // El requisito es que "tenga el rol de seller". Si no lo es, devolvemos un error.
    if (user.role !== "seller") {
      console.warn(
        `Usuario ${id} tiene el rol "${user.role}" en lugar de "seller".`
      );
      return NextResponse.json(
        { success: false, error: "Access Denied: User is not a seller." },
        { status: 403 } // 403 Forbidden o 404 para ocultar que el usuario existe pero no cumple el rol.
      );
    }

    // 3. Obtener datos de Clerk usando el clerkId.
    const { users } = await clerkClient();
    const seller = await users.getUser(user!.clerkId);

    // 4. Desestructuración y formateo de datos
    const {
      firstName,
      lastName,
      imageUrl,
      id: clerkId,
      emailAddresses,
      phoneNumbers,
    } = seller;
    const fullName = `${firstName} ${lastName}`.trim() || "Usuario anónimo";

    // 5. Construir y devolver el objeto UserData
    const userData: UserData = {
      id: user.id, 
      fullName,
      imageUrl,
      clerkId: clerkId, 
      // Se asume que siempre hay al menos una dirección de correo/teléfono o se usa un string vacío
      email: emailAddresses[0]?.emailAddress || "",
      phone: phoneNumbers[0]?.phoneNumber || "",
      role: user.role, 
      reputation: user.reputation ?? 0, 
      reviewsCount: user.reviewsReceived.length, 
    };

    // 7. Devolver el objeto UserData con un status 200 (CORREGIDO: Usa NextResponse.json)
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuario", error);
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("User");
  const g = await getTranslations("General");
  
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
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
  const t = await getTranslations("User");
  const g = await getTranslations("General");
  
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    if (!id) {
      return NextResponse.json(
        { error: t("InvaliduserID") },
        { status: 400 }
      );
    }

    await prisma.user.deleteMany({
      where: { id: String(id), isActive: false },
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
  const t = await getTranslations("User");
  const g = await getTranslations("General");
  
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  if (!id) {
    return NextResponse.json(
      { error: t("InvaliduserID") },
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
          error: g("ValidationsErrors"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: g("UserNotFound") },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}
