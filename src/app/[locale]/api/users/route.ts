import { z } from "zod";
import prisma from "@/lib/prisma";
import { UserSchema, PaginationSchema } from "@/lib/schemas/user";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";

// GET - Obtener todas los usuarios con paginado
export async function GET(req: NextRequest) {

  const t = await getTranslations("User.errors");

  try {
    const { searchParams } = new URL(req.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    });

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {
          isActive: true
        }        
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: users,
      meta: {
        total,
        page:pagination.page,
        llimit:pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}

// POST - Insertar nuevo usuario
export async function POST(req: Request) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error}, { status: code });
  }

  const t = await getTranslations("User.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await req.json();
    console.log(body); // Verifica los datos recibidos

    // 2. Validar con Zod
    const validatedData = UserSchema.parse(body);

    // 3. Crear usuario en Prisma
    const user = await prisma.user.create({
      //data: validatedData,
      data: {
        name:validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone
      }      
    });

    return NextResponse.json(
      { data: user },
      { status: 201 }
    );

  } catch (error) {
    // Manejo de errores específicos de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: t("ValidationsErrors"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Otros errores (ej: fallo en Prisma)
    return NextResponse.json(
      { error: t("ServerError") },
      { status: 500 }
    );
  }
}