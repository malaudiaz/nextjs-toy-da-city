import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(
    request
  );

  if (!success && !userId) {
    return NextResponse.json(
      {
        success: success,
        error: error,
      },
      { status: code }
    );
  }

  const t = await getTranslations("Favorite.errors");

  const { id } = await params; // Safe to use


  try {
    const existingFavoriteToy = await prisma.favoriteToy.findUnique({
      where: { id: Number(id) }
    })

    if (!existingFavoriteToy) {
      return NextResponse.json(
        { success: false, error: t("InvalidFavoriteToyID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedFavoriteToy = await prisma.favoriteToy.update({
      where: { id: Number(id) },
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