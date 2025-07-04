import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params;

  console.log(locale);

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

  try {
    // 1. Verificar si la condicion existe
    const existingCondition = await prisma.condition.findUnique({
      where: { id: Number(id) }
    })

    if (!existingCondition) {
      return NextResponse.json(
        { success: false, error: t("InvalidConditionID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedCondition = await prisma.condition.update({
      where: { id: Number(id) },
      data: {
        isActive: !existingCondition.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCondition,
      message: `Condition ${updatedCondition.isActive ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cambiar el estado de la condición del juguete' 
      },
      { status: 500 }
    )
  }
}