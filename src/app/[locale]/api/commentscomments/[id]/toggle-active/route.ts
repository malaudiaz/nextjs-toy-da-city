import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { success, userId, error, code } = await getAuthUserFromRequest(
    req
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

  const { id } = await params; // Safe to use

  try {
    // 1. Verificar si el comemtario existe
    const existingComments = await prisma.commentsComments.findUnique({
      where: { id: id }
    })

    if (!existingComments) {
      return NextResponse.json(
        { success: false, error: t("InvalidCommentsID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedComments = await prisma.commentsComments.update({
      where: { id: id },
      data: {
        isActive: !existingComments.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedComments,
      message: `Comentario ${updatedComments.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado del comentario' 
      },
      { status: 500 }
    )
  }
}