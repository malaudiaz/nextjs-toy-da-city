// app/api/status/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";


// Obtener un favorito por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  const g = await getTranslations("General");
  const t = await getTranslations("Favorite");

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

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
    const favorite = await prisma.favoriteToy.findUnique({
      where: {
        unique_favorite: {
          // 👈 Clave compuesta
          userId: user.id,
          toyId: id,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: t("NotFound") },
        { status: 404 }
      );
    }

    return NextResponse.json(favorite);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: t("UpdateError") },
      { status: 500 }
    );
  }
}
