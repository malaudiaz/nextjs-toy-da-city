import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
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

  const t = await getTranslations("Toy.errors");

  try {
    // 1. Verificar si la categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: t("InvalidCategoryID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        isActive: !existingCategory.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: `Categoria ${updatedCategory.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado de la categoria' 
      },
      { status: 500 }
    )
  }
}