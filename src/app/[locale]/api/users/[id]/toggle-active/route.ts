import { NextResponse } from 'next/server'
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = await getTranslations("User.errors");
  const g = await getTranslations("General.errors");
  
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id } = await params; // Safe to use

  try {
    // 1. Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: String(id) }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: t("InvalidUserID") },
        { status: 404 }
      )
    }

    // 2. Cambiar el estado isActive (toggle)
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: {
        isActive: !existingUser.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User successfully ${updatedUser.isActive ? 'activated' : 'deactivated'} `
    })

  } catch (error) {
    console.error('Error changing user: ', error)
    return NextResponse.json(
      { 
        success: false, 
        error: g('ServerError') 
      },
      { status: 500 }
    )
  }
}