import { NextResponse, NextRequest } from 'next/server'
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Status.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Verificar si el estado existe
    const existingStatus = await prisma.status.findUnique({
      where: { id: Number(id) }
    })

    if (!existingStatus) {
      return NextResponse.json(
        { success: false, error: t("InvalidId") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedStatus = await prisma.status.update({
      where: { id: Number(id) },
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
    return NextResponse.json(
      { 
        success: false, 
        error: t("UpdateError")
      },
      { status: 500 }
    )
  }
}