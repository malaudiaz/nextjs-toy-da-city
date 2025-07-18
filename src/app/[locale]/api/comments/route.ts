import { z } from "zod";
import prisma from "@/lib/prisma";
import { CommentsSchema, PaginationSchema} from "@/lib/schemas/comments";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all comments con paginación y búsqueda
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ toyId: string }> }
) {
  
  const t = await getTranslations("Comments.errors");

  const { toyId } = await params;


  try {
    const { searchParams } = new URL(req.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });
    
    const [comments, total] = await Promise.all([
      prisma.toyComments.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {isActive: true, toyId: toyId}        
      }),
      prisma.toyComments.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: comments,
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


// POST create a new comments
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
    const validatedData = CommentsSchema.parse(body);

    // 3. Crear comments en Prisma
    const comments = await prisma.toyComments.create({
      //data: validatedData,
      data: {
        summary:validatedData.summary,
        userId: userId!
      }      
    });

    return NextResponse.json(
      { data: comments },
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
      { error: t("Failed to create comments") },
      { status: 500 }
    );
  }
}
