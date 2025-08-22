import { z } from "zod";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


// GET all favorites con paginación y búsqueda
export async function GET() {
  const t = await getTranslations("Favorite.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    
    const [favoriteToy, total] = await Promise.all([
      prisma.favoriteToy.findMany({
        where: {
          userId: userId 
        },
        include: {
          toy: true 
        }     
      }),
      prisma.favoriteToy.count({
        where: {
          userId: userId // Filtra el conteo también por userId
        }
      })
    ]);

    return NextResponse.json({
      status: 200,
      data: favoriteToy,
      meta: {
        total
        },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}

// POST add a new favorite toy
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const t = await getTranslations("Favorite.errors");

  try {
    const body = await req.json();

    const { toyId } = body;

    if (!toyId) {
      return NextResponse.json(
        { error: t("ToyIdRequired") },
        { status: 400 }
      );
    }

    const favorite_toy = await prisma.favoriteToy.create({
      data: {
        userId: userId!,
        toyId
      },
      include: {
        toy: true
      }  
    });

    return NextResponse.json(
      { data: favorite_toy },
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
      { error: t("Failed to create toy favorites") },
      { status: 500 }
    );
  }
}
