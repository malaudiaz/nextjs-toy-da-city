// app/api/user/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params; // Safe to use

  if (!id) {
    return NextResponse.json({ error: "Falta clerkId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { error: "No se pudo obtener usuario" },
      { status: 500 }
    );
  }
}
