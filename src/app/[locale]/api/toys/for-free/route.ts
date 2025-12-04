import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";

type Media = {
  id: string
  fileUrl: string
  type: 'IMAGE' | 'VIDEO'
  toyId: string
  createdAt?: Date
  updatedAt?: Date
}

type Toy = {
  id: string
  title: string
  description: string
  price: number
  conditionId: number
  categoryId: number
  forSell: boolean
  forGifts: boolean
  forChanges: boolean
  createdAt?: Date
  updatedAt?: Date
  sellerId: string
  media: Media[]
  categoryDescription?: string
  conditionDescription?: string
  statusDescription?: string
};

export async function GET(req: Request) {
  // 0. Obtener el lenguaje de la URL
  const { pathname } = new URL(req.url);
  // Ejemplo: /es/config/swap
  const pathSegments = pathname.split("/");
  // pathSegments: ["", "es", "config", "swap"]
  const locale = pathSegments[1]; // "es"

  // --- 1. Autenticación ---
  let { userId } = await auth();
  const g = await getTranslations("General");
  
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
  const statusName = searchParams.get("status"); // Ej: ?status=sold — puede ser null

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
      forGifts: true,
      isActive: true
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
        category: {
          include: {
            translations: {
              where: { languageId: locale, key: "name" },
              select: { value: true },
            },
          },
        },
        condition: {
          include: {
            translations: {
              where: { languageId: locale, key: "name" },
              select: { value: true },
            },
          },
        },
        status: {
          include: {
            translations: {
              where: { languageId: locale, key: "name" },
              select: { value: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const toysForFree: Toy[] = [];  

    toys.map((toy) => {
      toysForFree.push({
        ...toy,
        categoryDescription: toy.category.translations[0]?.value || "",
        conditionDescription: toy.condition.translations[0]?.value || "",
        statusDescription: toy.status.translations[0]?.value || "",
      });
    });

    // --- 6. Respuesta ---
    return NextResponse.json(toysForFree, { status: 200 });
  } catch (error) {
    console.error("Error fetching toys for gifts:", error); // ← Ajusté el mensaje de log para reflejar gifts
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}