import { NextResponse } from 'next/server'
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("Categories.errors");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: t("Unauthorized") }, { status: 401 });
  }


  const { id } = await params; // Safe to use


  try {
    // 1. Verificar si la categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: t("InvalidId") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
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
    return NextResponse.json(
      { 
        success: false, 
        error: t("UpdateError")
      },
      { status: 500 }
    )
  }
}