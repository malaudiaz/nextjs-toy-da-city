import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
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
          error: "User not found",
        },
        { status: 404 }
      );
    } else {
      userId = user.id;
    }
  }

  const { locale } = await params;

  const userLanguageCode = locale;

  const t = await getTranslations("Toy.errors");

  try {
    const toy = await prisma.toy.findMany({
      where: { sellerId: userId!, isActive: true },
      include: {
        media: true,
        category: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        condition: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        status: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        comments: {
          where: { isActive: true },
          select: {
            // Selecciona solo los campos necesarios
            id: true,
            summary: true,
            userId: true,
          },
          take: 4, // Límite de 4 comentarios
          skip: 0, // Opcional: Saltar los primeros X (útil para paginación)
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: {
              where: { isActive: true }, // Filtra solo comentarios activos
            },
          },
        },
      }
    });

    if (!toy) {
      return NextResponse.json({ error: t("ToyNotFound") }, { status: 404 });
    }

    return NextResponse.json(toy);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
