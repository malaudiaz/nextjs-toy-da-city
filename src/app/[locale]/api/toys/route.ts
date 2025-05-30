import { z } from "zod";
import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { ToySchema, PaginationSchema} from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all toys con paginación y búsqueda
export async function GET(request: NextApiRequest) {
  
  const { userId } = await getAuthUserFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Toy.errors");

  let p =1;
  let l = 10;

  if (request.query) {
    p = request.query.page ? parseInt(request.query.page as string) : p;
    l = request.query.limit ? parseInt(request.query.limit as string) : l;  
  }

  try {
    const { page, limit } = PaginationSchema.parse({
      page: p,
      limit: l,
    });

    const [toy, total] = await Promise.all([
      prisma.status.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }       
      }),
      prisma.toy.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: toy,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}


// POST create a new toy
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  const t = await getTranslations("Toy.errors");

  try {
    // 1. Obtener el cuerpo de la solicitud
    const body = await request.json();
    console.log(body); // Verifica los datos recibidos

    // 2. Validar con Zod
    const validatedData = ToySchema.parse(body);

    // 3. Crear toy en Prisma
    const toy = await prisma.toy.create({
      //data: validatedData,
      data: {
        description: validatedData.description,
        price: validatedData.price,
        location: validatedData.location,
        recommendedAge: validatedData.recommendedAge,
        userId: userId
      }      
    });

    return NextResponse.json(
      { data: toy },
      { status: 201 }
    );

  } catch (error) {
    // Manejo de errores específicos de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: t("ValidationsErrors"),
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Otros errores (ej: fallo en Prisma)
    return NextResponse.json(
      { error: t("Failed to create status") },
      { status: 500 }
    );
  }
}
