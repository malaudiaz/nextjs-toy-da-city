import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { PaginationSchema} from "@/lib/schemas/toy";

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url!)
  
  const pagination = PaginationSchema.parse({
    page: parseInt(searchParams.get('page') || "1"),
    limit: parseInt(searchParams.get('limit') || "4")
  });

  try {
    // --- 3. Obtener IDs de juguetes favoritos del usuario ---
    // const favoriteToys = await prisma.favoriteToy.findMany({
    //   where: {
    //     userId: user.id,
    //   },
    //   select: {
    //     toyId: true,
    //   },
    // });

    const whereCondition = { userId: user.id };

    const query = {
      where: whereCondition,
      select: {toyId: true},
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    };

    // Ejecutar consulta
    const [favoriteToys, totalCount] = await Promise.all([
      prisma.favoriteToy.findMany(query),
      prisma.favoriteToy.count({where: whereCondition})
    ])
    
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
    return NextResponse.json({
      success: true,
      data: toys, 
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        currentPage: pagination.page,
        perPage: pagination.limit
      }
    })
    // return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorite toys:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}