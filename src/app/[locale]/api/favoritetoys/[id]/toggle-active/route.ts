import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Favorite.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    const existingFavoriteToy = await prisma.favoriteToy.findUnique({
      where: { id: id}
    })

    if (!existingFavoriteToy) {
      return NextResponse.json(
        { success: false, error: t("InvalidFavoriteToyID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedFavoriteToy = await prisma.favoriteToy.update({
      where: { id: id },
      data: {
        isActive: !existingFavoriteToy.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedFavoriteToy,
      message: `Favorite Toy ${updatedFavoriteToy.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado del juguete favorito' 
      },
      { status: 500 }
    )
  }
}