import { z } from "zod";
import prisma from "@/lib/prisma";
import { CartItemSchema, PaginationSchema} from "@/lib/schemas/cart";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all items of cart con paginación
export async function GET(req: NextRequest) {
  
  const t = await getTranslations("Cart.errors");

  try {
    const { userId} = await getAuthUserFromRequest(req);

    const { searchParams } = new URL(req.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    });

    const [cart, total] = await Promise.all([
      prisma.cart.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        where: {userId: userId},
        include: {
          items: {
            include: {
              toy: {
                include: {
                  media: true,
                  category: true
                }
              }
            }
          }
        }        
      }),
      prisma.cart.count(),
    ]);

    return NextResponse.json({
      status: 200,
      data: cart,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}

// POST create a new status
export async function POST(req: Request) {
  const { success, userId, error, code } = await getAuthUserFromRequest(req);

  if (!success && !userId) {
    return NextResponse.json({ error: error}, { status: code });
  }

  const t = await getTranslations("Cart.errors");

  try {
    const body = await req.json();

    console.log('valores en body');
    console.log(body.toyId);

    const validatedData = CartItemSchema.parse({
      toyId: body.toyId,
      quantity: Number(body.quantity) || 1,
      selected: typeof body.selected === 'string' 
        ? body.selected === 'true' 
        : Boolean(body.selected)
    });

    console.log('valores');
    console.log(validatedData.toyId);

    const toy = await prisma.toy.findUnique({ where: { id: validatedData.toyId } });

    if (!toy) {
      return NextResponse.json({ error: 'ToyNotFound'}, { status: 404 });
    }

    const existingCart = await prisma.cart.findUnique({
      where: { userId }
    });

    const cart = await prisma.cart.upsert({
      where: { userId: userId},
      create: {
        user: { connect: { id: userId} },
        items: {
          create: {
            toyId: validatedData.toyId, 
            quantity: validatedData.quantity,
            selected: validatedData.selected,
            priceAtAddition: toy.price
          }
        }
      },
      update: {
        items: {
          upsert: {
            where: { cartId_toyId: { cartId: existingCart?.id ?? '', toyId: validatedData.toyId } },
            create: {
              toyId: validatedData.toyId, 
              quantity: validatedData.quantity,
              selected: validatedData.selected,
              priceAtAddition: toy.price
            },
            update: {
              quantity: { increment: validatedData.quantity },
              selected: validatedData.selected,
              priceAtAddition: toy.price
            }
          }
        }
      },
      include: { items: true }
    });

    return NextResponse.json(
      { data: cart },
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
      { error: t("FailedCreateCart") },
      { status: 500 }
    );
  }
}
