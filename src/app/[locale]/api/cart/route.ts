import { z } from "zod";
import prisma from "@/lib/prisma";
import { CartItemSchema, PaginationSchema} from "@/lib/schemas/cart";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";


// GET all items of cart con paginación, del usuario logueado
export async function GET(req: NextRequest) {
  
  const t = await getTranslations("Cart.errors");

  try {
    const { userId} = await getAuthUserFromRequest(req);
    // const userId = 'user_2xMoqaxDWhsUmKjITZbWHRJMo8Z'

    const { searchParams } = new URL(req.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    });

    const [cartItems, total] = await Promise.all([
      prisma.cartItem.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { addedAt: "desc" },
        where: { 
          cart: { userId: userId } // Filtra por usuario
        },
        select: {
          id: true,          // ID del item del carrito
          quantity: true,    // Cantidad
          selected: true,    // Si está seleccionado
          toy: {             // Datos específicos del juguete
            select: {
              id: true,      // ID del juguete (como toyId)
              title: true,   // Título del juguete
              price: true    // Precio del juguete
            }
          }
        }
      }),
      prisma.cartItem.count({
        where: { 
          cart: { userId: userId } 
        }
      }),
    ]);

    // Transformar la estructura para aplanar el objeto toy
    const formattedItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      selected: item.selected,
      toyId: item.toy.id,    // Extraemos el ID del juguete
      title: item.toy.title, // Extraemos el título
      price: item.toy.price  // Extraemos el precio
    }));

    return NextResponse.json({
      status: 200,
      data: formattedItems, // Usamos los items formateados
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

    const validatedData = CartItemSchema.parse({
      toyId: body.toyId,
      quantity: Number(body.quantity) || 1,
      selected: typeof body.selected === 'string' 
        ? body.selected === 'true' 
        : Boolean(body.selected)
    });

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
