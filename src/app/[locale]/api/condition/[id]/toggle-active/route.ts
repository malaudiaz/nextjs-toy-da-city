import { NextResponse, NextRequest } from 'next/server'
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {
  const t = await getTranslations("Condition.errors");

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Verificar si la condicion existe
    const existingCondition = await prisma.condition.findUnique({
      where: { id: Number(id) }
    })

    if (!existingCondition) {
      return NextResponse.json(
        { success: false, error: t("InvalidId") },
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

  } catch {
    return NextResponse.json(
      { 
        success: false, 
        error: t("UpdateError")
      },
      { status: 500 }
    )
  }
}