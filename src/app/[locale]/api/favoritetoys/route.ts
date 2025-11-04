import { z } from "zod";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET all favorites con paginación y búsqueda
export async function GET() {
  const g = await getTranslations("General");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

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

  try {
    const [favoriteToy, total] = await Promise.all([
      prisma.favoriteToy.findMany({
        where: {
          userId: user.id,
        },
        include: {
          toy: true,
        },
      }),
      prisma.favoriteToy.count({
        where: {
          userId: userId, // Filtra el conteo también por userId
        },
      }),
    ]);

    return NextResponse.json({
      status: 200,
      data: favoriteToy,
      meta: {
        total,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("InvalidInputParams") }, { status: 400 });
  }
}

// POST add a new favorite toy
export async function POST(req: Request) {
  const t = await getTranslations("Favorite");
  const g = await getTranslations("General");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  try {
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

    const body = await req.json();

    const { toyId } = body;

    if (!toyId) {
      return NextResponse.json({ error: t("ToyIdRequired") }, { status: 400 });
    }

    const favorite = await prisma.favoriteToy.findUnique({
      where: {
        unique_favorite: {
          // 👈 Clave compuesta
          userId: user.id,
          toyId,
        },
      },
    });

    if (!favorite) {
      const favorite_toy = await prisma.favoriteToy.create({
        data: {
          userId: user.id,
          toyId,
        },
        include: {
          toy: true,
        },
      });

      return NextResponse.json({ data: favorite_toy }, { status: 200 });
    } else {
      const favorite_toy = await prisma.favoriteToy.delete({
        where: {
          unique_favorite: {
            // 👈 Clave compuesta
            userId: user.id,
            toyId,
          },
        },
        include: {
          toy: true,
        },
      });

      return NextResponse.json({ data: favorite_toy }, { status: 200 });
    }
  } catch (error) {
    // Manejo de errores específicos de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: g("ValidationsError"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Otros errores (ej: fallo en Prisma)
    return NextResponse.json(
      { error: t("CreatedError") },
      { status: 500 }
    );
  }
}
