import { z } from "zod";
import prisma from "@/lib/prisma";
import { StatusSchema, PaginationSchema} from "@/lib/schemas/status";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all statuses con paginación y búsqueda
export async function GET(req: NextRequest) {
  
  const t = await getTranslations("Status.errors");

  try {
    const { searchParams } = new URL(req.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    });

    const [status, total] = await Promise.all([
      prisma.status.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {
          isActive: true
        }        
      }),
      prisma.status.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: status,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}


// POST create a new status
export async function POST(req: Request) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error}, { status: code });
  }

  const t = await getTranslations("Status.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = StatusSchema.parse(body);

    // 3. Crear status en Prisma
    const status = await prisma.status.create({
      //data: validatedData,
      data: {
        name:validatedData.name,
        description: validatedData.description,
        userId: userId!
      }      
    });

    return NextResponse.json(
      { data: status },
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
      { error: t("Failed to create status") },
      { status: 500 }
    );
  }
}
