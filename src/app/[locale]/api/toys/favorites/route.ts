import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export async function GET(req: Request) {
  // --- 1. Autenticación ---
  let { userId } = await auth();
  const g = await getTranslations("General.errors");
  
  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  // --- 2. Verificar que el usuario existe en tu base ---
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  try {
    // --- 3. Obtener IDs de juguetes favoritos del usuario ---
    const favoriteToys = await prisma.favoriteToy.findMany({
      where: {
        userId: user.id,
      },
      select: {
        toyId: true,
      },
    });

    const favoriteToyIds = favoriteToys.map(f => f.toyId);

    if (favoriteToyIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // Sin favoritos
    }

    // --- 4. Obtener los juguetes completos ---
    const toys = await prisma.toy.findMany({
      where: {
        id: {
          in: favoriteToyIds, // Solo los que están en favoritos
        },
        isActive: true, // Opcional: solo juguetes activos
      },
      include: {
        media: true,
        category: true,
        condition: true,
        status: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // --- 5. Respuesta ---
    return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorite toys:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}