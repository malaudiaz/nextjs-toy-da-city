import { z } from "zod";
import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { StatusSchema, PaginationSchema} from "@/lib/schemas/status";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all statuses con paginación y búsqueda
export async function GET(request: NextApiRequest) {
  
  const { userId } = await getAuthUserFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Status.errors");

  let p =1;
  let l = 10;

  if (request.query) {
    p = request.query.page ? parseInt(request.query.page as string) : p;
    l = request.query.limit ? parseInt(request.query.limit as string) : l;  
  }

  try {
    const { page, limit } = PaginationSchema.parse({
      page: p,
      limit: l,
    });

    const [status, total] = await Promise.all([
      prisma.status.findMany({
        skip: (page - 1) * limit,
        take: limit,
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


// POST create a new status
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Status.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await request.json();
    console.log(body); // Verifica los datos recibidos

    // 2. Validar con Zod
    const validatedData = StatusSchema.parse(body);

    // 3. Crear status en Prisma
    const status = await prisma.status.create({
      //data: validatedData,
      data: {
        name:validatedData.name,
        description: validatedData.description,
        userId: userId
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
