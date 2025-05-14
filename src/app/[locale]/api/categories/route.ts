import { z } from "zod";
import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { CategorySchema, PaginationSchema } from "@/lib/schemas/category";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";

// GET - Obtener todas las categorías con paginado
export async function GET(req: NextApiRequest) {

  const { userId } = await getAuthUserFromRequest(req);

  //const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const t = await getTranslations("Categories.errors");

  let p =1;
  let l = 10;

  if (req.query) {
    p = req.query.page ? parseInt(req.query.page as string) : p;
    l = req.query.limit ? parseInt(req.query.limit as string) : l;  
  }

  try {
    const { page, limit } = PaginationSchema.parse({
      page: p,
      limit: l,
    });

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}

// app/api/categories/route.ts
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const t = await getTranslations("Categories.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await request.json();
    console.log(body); // Verifica los datos recibidos

    // 2. Validar con Zod
    const validatedData = CategorySchema.parse(body);

    // 3. Crear categoría en Prisma
    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(
      { data: category },
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