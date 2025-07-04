import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

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
  const { id } = await params; // Safe to use

  try {
    // 1. Verificar si el juguete existe
    const existingToy = await prisma.toy.findUnique({
      where: { id: id }
    })

    if (!existingToy) {
      return NextResponse.json(
        { success: false, error: t('ToyNotFound') },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedToy = await prisma.toy.update({
      where: { id: id },
      data: {
        isActive: !existingToy.isActive
      },
      include: {
        media: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedToy,
      message: `Juguete ${updatedToy.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado del juguete' 
      },
      { status: 500 }
    )
  }
}