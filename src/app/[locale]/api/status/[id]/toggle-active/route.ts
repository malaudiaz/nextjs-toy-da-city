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
    const existingStatus = await prisma.status.findUnique({
      where: { id: params.id }
    })

    if (!existingStatus) {
      return NextResponse.json(
        { success: false, error: 'Estado no encontrado' },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedStatus = await prisma.status.update({
      where: { id: params.id },
      data: {
        isActive: !existingStatus.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedStatus,
      message: `Estado ${updatedStatus.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado del estado' 
      },
      { status: 500 }
    )
  }
}