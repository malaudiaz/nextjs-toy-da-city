import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  // --- 1. Autenticación ---
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- 2. Verificar que el usuario existe en tu base ---
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // --- 3. Obtener parámetro de estado (opcional) ---
  const { searchParams } = new URL(req.url);
  const statusName = searchParams.get("status"); // Ej: ?status=sold

  if (!statusName) {
    return NextResponse.json(
      { error: "Status query parameter is required" },
      { status: 400 }
    );
  }

  const existingStatus = await prisma.status.findUnique({
    where: { name: statusName },
  });

  if (!existingStatus) {
    return NextResponse.json(
      { error: `Status "${statusName}" not found` },
      { status: 400 }
    );
  }

  try {
    // --- 4. Construir filtro dinámico ---
    const where: Prisma.ToyWhereInput = {
      sellerId: user.id,
      forGifts: true,
      statusId: existingStatus.id,
    };

    // --- 5. Consultar juguetes ---
    const toys = await prisma.toy.findMany({
      where,
      include: {
        media: true,
        category: true,
        condition: true,
        status: true, // Incluye el objeto status en la respuesta
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // --- 6. Respuesta ---
    return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("Error fetching toys for sale:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
