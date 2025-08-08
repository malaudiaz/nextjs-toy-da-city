// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
  userId: string;
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
  stripeAccountId: string;
}

const transformCart = async (cartItems: CartItem[]) => {
  const lineItems: StripeLineItem[] = [];

  for (const item of cartItems) {
    const { price, quantity, userId } = item;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeAccountId: true },
    }); 

    if (user?.stripeAccountId) {
      const priceInCents = Math.round(price * 100);
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(item.image && { images: [item.image] }),
          },
          unit_amount: priceInCents,
        },
        quantity: quantity,
        stripeAccountId: user.stripeAccountId,
      });
    }
  }
  
  return lineItems
}

export async function POST(request: Request) {
  const { success, userId, error, code } = await getAuthUserFromRequest(request);

  if (!success && !userId) {
    return NextResponse.json(
        { 
          success: success, 
          error: error 
        },
        { status: code }
      )    
  }

  try {
    const { cartItems }: { cartItems: CartItem[] } = await request.json();
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const successUrl = `${origin}/es/successfull-payment?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${origin}/es/cart`;

    // Transformar items al formato de Stripe
    const lineItems = await transformCart(cartItems);

    // Calculate platform fee (optional, in cents)
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const applicationFeeAmount = Math.round(totalAmount * 100 * 0.1); // 10% fee

    // Create Checkout session with explicit typing
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: "en",
      metadata: {
        cart_items: JSON.stringify(cartItems.map((item) => item.id)),
        connected_account_id: "",
        locale: "en",
      },
      transfer_data: {
        destination: "",
      },
      application_fee_amount: applicationFeeAmount,
    } as Stripe.Checkout.SessionCreateParams; 

    const session = await stripe.checkout.sessions.create(sessionParams);


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
