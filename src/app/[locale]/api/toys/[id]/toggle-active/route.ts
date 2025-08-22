import { NextResponse, NextRequest } from 'next/server'
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Toy.errors");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

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