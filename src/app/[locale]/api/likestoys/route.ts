import { z } from "zod";
import prisma from "@/lib/prisma";
//import { LikesToySchema} from "@/lib/schemas/likestoy";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all likes con paginación y búsqueda
export async function GET(req: NextRequest) {
  
  const t = await getTranslations("Likes.errors");

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { searchParams } = new URL(req.url!)
    
    const [toyLikes, total] = await Promise.all([
      prisma.toyLikes.findMany({
        where: {
          isActive: true
        }        
      }),
      prisma.toyLikes.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: toyLikes,
      meta: {
        total
        },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}


// POST create a new likes
export async function POST(req: Request) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error}, { status: code });
  }

  const t = await getTranslations("Likes.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await req.json();

    // 2. Crear toys likes en Prisma
    const toy_likes = await prisma.toyLikes.create({
      //data: validatedData,
      data: {
        userId: userId!
      }      
    });

    return NextResponse.json(
      { data: toy_likes },
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
      { error: t("Failed to create toy likes") },
      { status: 500 }
    );
  }
}
