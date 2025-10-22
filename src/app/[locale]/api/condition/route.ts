import { z } from "zod";
import prisma from "@/lib/prisma";
import { ConditionSchema, PaginationSchema} from "@/lib/schemas/condition";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET all conditions con paginación y búsqueda
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  
  const { locale } = await params;
  const g = await getTranslations("General.errors");
  
  try {
    const { searchParams } = new URL(req.url!)
    
    const userLanguageCode = locale
   
    const languageExists = await prisma.language.findUnique({
      where: { code: userLanguageCode }
    });

    if (!languageExists) {
      throw new Error('Language ${userLanguageCode} not supported');
    }

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    const [condition, total] = await Promise.all([
      prisma.condition.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        include: {translations: 
          {
            where: {
              language: { code: userLanguageCode },
              key: "name" 
            },
            select: {
              value: true
            }
          }
        }, 
        where: {
          isActive: true
        }        
      }),
      prisma.condition.count(),
    ]);

    const result_condition = condition.map(condition => ({
      id: condition.id, name: condition.translations[0]?.value || condition.name,
      description: condition.description, userId: condition.userId, isActive: condition.isActive
    })
    
    )
    
    return NextResponse.json({
      status: 200,
      data: result_condition,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("InvalidParams") }, { status: 400 });
  }
}


// POST create a new condition
export async function POST(req: Request) {
  const g = await getTranslations("General.errors");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = ConditionSchema.parse(body);

    // 3. Crear condition en Prisma
    const condition = await prisma.condition.create({
      //data: validatedData,
      data: {
        name:validatedData.name,
        description: validatedData.description,
        userId: userId!
      }      
    });

    return NextResponse.json(
      { data: condition },
      { status: 201 }
    );

  } catch (error) {
    // Manejo de errores específicos de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: g("ValidationsErrors"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Otros errores (ej: fallo en Prisma)
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}
