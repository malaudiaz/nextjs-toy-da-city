import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  userId: string; // ID interno del vendedor (User.id)
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems }: { cartItems: CartItem[] } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron ítems." },
        { status: 400 }
      );
    }

    // === PASO 1: Agrupar por vendedor (usando el sellerId interno) ===
    const itemsByInternalSellerId = cartItems.reduce((acc, item) => {
      const key = item.userId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // === PASO 2: Obtener el stripeAccountId real de cada vendedor ===
    const sessions: { sellerId: string; url: string }[] = [];
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const cartKey = `cart_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    for (const [internalSellerId, sellerItems] of Object.entries(
      itemsByInternalSellerId
    )) {
      // 🔍 Buscar el usuario por su `id` (UUID interno)
      const seller = await prisma.user.findUnique({
        where: { id: internalSellerId },
      });

      if (!seller) {
        return NextResponse.json(
          { error: `Vendedor con id ${internalSellerId} no encontrado.` },
          { status: 404 }
        );
      }

      if (!seller.stripeAccountId) {
        return NextResponse.json(
          {
            error: `El vendedor ${seller.name} no tiene cuenta Connect configurada.`,
          },
          { status: 400 }
        );
      }

      // ✅ Ahora tenemos el verdadero ID de Stripe
      const userId = seller.id;
      const stripeAccountId = seller.stripeAccountId; // → "acct_123abc"

      // Crear line_items para este vendedor
      const lineItems = sellerItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Calcular comisión (1%)
      const totalAmount = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const applicationFeeAmount = Math.round(totalAmount * 0.01);

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",

          // ✅ Usa payment_intent_data para la comisión
          payment_intent_data: {
            application_fee_amount: applicationFeeAmount, // en centavos
          },
          success_url: `${origin}/api/checkout/handle-success?session_id={CHECKOUT_SESSION_ID}&seller_id=${seller.stripeAccountId}`,
          cancel_url: `${origin}/cart`,
          metadata: {
            buyer_id: userId, // en producción, usa auth real
            seller_internal_id: internalSellerId,
            seller_stripe_id: stripeAccountId,
            items: JSON.stringify(
              sellerItems.map((i) => ({
                id: i.id,
                name: i.name,
                price: i.price,
              }))
            ),
          },
          client_reference_id: cartKey,
        },
        {
          // ✅ Actuar en nombre del vendedor
          stripeAccount: seller.stripeAccountId,
        }
      );

      sessions.push({
        sellerId: stripeAccountId,
        url: session.url!,
      });
    }

    // ✅ Guardar en Redis (con expiración de 1 hora)

    await redis.setEx(
      `cart_data:${cartKey}`,
      3600,
      JSON.stringify(
        Object.entries(itemsByInternalSellerId).map(([internalId, items]) => ({
          internalSellerId: internalId,
          items,
        }))
      )
    );

    return NextResponse.json({
      sessions,
      cartKey,
      firstUrl: sessions[0]?.url,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Error desconocido:", error);
    return NextResponse.json(
      { error: "Ocurrió un error desconocido" },
      { status: 500 }
    );
  }
}
