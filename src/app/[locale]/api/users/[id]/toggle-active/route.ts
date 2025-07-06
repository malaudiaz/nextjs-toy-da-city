import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthUserFromRequest } from '@/lib/auth';
import { getTranslations } from "next-intl/server";

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

  const t = await getTranslations("User.errors");

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
        error: 'Error changing user status' 
      },
      { status: 500 }
    )
  }
}