import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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

  // --- 3. Obtener parámetro de estado (opcional) ---
  const { searchParams } = new URL(req.url);
  let statusName = searchParams.get("status"); // Ej: ?status=sold — puede ser null

  if (!statusName) {
    statusName = 'sold';
  }

  let statusId: number | undefined;

  if (statusName) {
    const existingStatus = await prisma.status.findUnique({
      where: { name: statusName },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: `Status "${statusName}" not found` },
        { status: 400 }
      );
    }
    statusId = existingStatus.id;
  }

  try {
    // --- 4. Construir filtro dinámico ---
    const where: Prisma.ToyWhereInput = {
      sellerId: user.id,
      forSell: true,
    };

    // Solo agregar statusId si se proporcionó un statusName válido
    if (statusId !== undefined) {
      where.statusId = statusId;
    }

    // --- 5. Consultar juguetes ---
    const toys = await prisma.toy.findMany({
      where,
      include: {
        media: true,
        category: true,
        condition: true,
        status: true,
        seller: { // Asegúrate de incluir el seller
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            order: {
              include: {
                buyer: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

   // --- 6. Respuesta ---
    return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("Error fetching toys for sale:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}