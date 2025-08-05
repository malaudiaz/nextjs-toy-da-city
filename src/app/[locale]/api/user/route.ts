// app/api/user/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: 'Falta clerkId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ error: 'No se pudo obtener usuario' }, { status: 500 });
  }
}