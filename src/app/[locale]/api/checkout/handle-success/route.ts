// app/api/checkout/handle-success/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import redis from "@/lib/redis"; // Ajusta la ruta según tu proyecto
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

// Tipo para los items del carrito
type CartItem = {
  id: string;
  name: string;
  price: number; // en dólares (ej: 6.99)
  quantity: number;
  sellerId: string; // UUID del vendedor en tu DB
};

// Tipo para los datos almacenados en Redis
type PendingSellerData = {
  internalSellerId: string;
  items: CartItem[];
};

type StripeConnectOptions = {
  stripeAccount?: string;
  application_fee_amount?: number;
} & Stripe.RequestOptions;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const sellerId = searchParams.get("seller_id"); // acct_... de Stripe

  // ✅ Validar que los parámetros existan
  if (!sessionId || !sellerId) {
    return NextResponse.redirect(new URL("/cart", req.url));
  }

  try {
    // ✅ Recuperar la sesión en nombre del vendedor
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      stripeAccount: sellerId,
    } as Stripe.RequestOptions);

    // ✅ Obtener el cartKey desde client_reference_id
    const cartKey = session.client_reference_id;
    if (!cartKey) {
      return NextResponse.redirect(new URL("/order-confirmed", req.url));
    }

    // ✅ Recuperar los datos pendientes desde Redis
    const pendingDataStr = await redis.get(`cart_data:${cartKey}`);
    if (!pendingDataStr) {
      // No hay más pagos pendientes
      return NextResponse.redirect(new URL("/order-confirmed", req.url));
    }

    let pendingSellers: PendingSellerData[] = JSON.parse(pendingDataStr);

    // esto es un ejemplo de lo que viene en PendingSellers cuando se estan pagando a dos vendedores distintos
    /* pendingSellers = 
    {
      internalSellerId: "6a114e75-3852-40bc-ab7b-cc87d0c83b35",
      items: [
        {
          id: "toy_002",
          name: "Loftus Surprise Hand Buzzer",
          price: 7.99,
          quantity: 1,
          image: "/images/f2.jpg",
          userId: "6a114e75-3852-40bc-ab7b-cc87d0c83b35",
        },
      ],
    }
    {
      internalSellerId: "82f62110-5aac-4aae-a3e2-b631190c73fa",
      items: [
        {
          id: "toy_007",
          name: "Metal toy army military tanks",
          price: 32.99,
          quantity: 1,
          image: "/images/f7.webp",
          userId: "82f62110-5aac-4aae-a3e2-b631190c73fa",
        },
      ],
    }    
 */
    // ✅ Eliminar al vendedor que acaba de ser pagado
    const sellerInternalId = session.metadata?.seller_internal_id;
    if (sellerInternalId) {
      pendingSellers = pendingSellers.filter(
        (s) => s.internalSellerId !== sellerInternalId
      );
    }

    // ✅ Actualizar Redis con los vendedores restantes
    await redis.setEx(
      `cart_data:${cartKey}`,
      3600,
      JSON.stringify(pendingSellers)
    );

    // ✅ Si no quedan más vendedores, termina
    if (pendingSellers.length === 0) {
      await redis.del(cartKey);
      return NextResponse.redirect(new URL("/order-confirmed", req.url));
    }

    // ✅ Preparar el siguiente vendedor
    const nextSeller = pendingSellers[0];
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // ✅ Obtener el stripeAccountId del vendedor desde la DB
    const seller = await prisma.user.findUnique({
      where: { id: nextSeller.internalSellerId },
    });

    if (!seller || !seller.stripeAccountId) {
      console.error(
        `Vendedor no encontrado o sin cuenta Connect: ${nextSeller.internalSellerId}`
      );
      return NextResponse.redirect(new URL("/cart", req.url));
    }

    // ✅ Calcular comisión (1% del total)
    const totalAmount = nextSeller.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const applicationFeeAmount = Math.round(totalAmount * 100 * 0.01); // en centavos

    // ✅ Crear una NUEVA sesión de Checkout para el siguiente vendedor
    const newSession = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: nextSeller.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // convertir a centavos
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${origin}/api/checkout/handle-success?session_id={CHECKOUT_SESSION_ID}&seller_id=${seller.stripeAccountId}`,
        cancel_url: `${origin}/cart`,
        metadata: {
          buyer_id: session.metadata?.buyer_id || "unknown",
          seller_internal_id: nextSeller.internalSellerId,
        },
        // ✅ Guardar cartKey para continuar el flujo
        client_reference_id: cartKey,
      },
      {
        // ✅ Actuar en nombre del vendedor
        stripeAccount: seller.stripeAccountId,
        application_fee_amount: applicationFeeAmount,
      } as StripeConnectOptions
    );

    // ✅ Actualizar Redis con los vendedores restantes
    await redis.setEx(cartKey, 3600, JSON.stringify(pendingSellers));

    // ✅ Redirigir a la nueva sesión (válida y fresca)
    return NextResponse.redirect(newSession.url!);
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
