// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Versión más reciente de la API (julio 2024)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // Versión actualizada
  typescript: true,
  timeout: 10000, // 10 segundos de timeout
  maxNetworkRetries: 2, // Reintentos automáticos
});

// types/cart.d.ts
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // Agrega otros campos necesarios
}

interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[];
      description?: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

export async function POST(request: Request) {
  console.log("request.url", request.url);
  try {
    const { cartItems }: { cartItems: CartItem[] } = await request.json();
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const successUrl = `${origin}/es/successfull-payment?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${origin}/es/cart`;

    // Transformar items al formato de Stripe
    const lineItems: StripeLineItem[] = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          ...(item.image && { images: [item.image] }),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        // Puedes añadir metadatos útiles para después
        cart_items: JSON.stringify(cartItems.map((item) => item.id)),
      },
    });

    return NextResponse.json({ sessionId: session.id });
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
