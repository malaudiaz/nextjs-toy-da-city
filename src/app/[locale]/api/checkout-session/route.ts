// pages/api/checkout-session.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

type StripeConnectOptions = {
  stripeAccount?: string;
  application_fee_amount?: number;
} & Stripe.RequestOptions;


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: NextRequest) {
  const { productId, sellerId, buyerId } = await req.json();

  const sellerAccountId = "acct_1RtuiYBCOktK6Tpw"

  // 2. Calcular precio y comisión (1%)
  const unitAmount = 600; // $6.00 USD
  const applicationFeeAmount = Math.round(unitAmount * 0.01); // 6 cents

  const origin = req.headers.get('origin') || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Mouse',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&product=mouse`,
      cancel_url: `${origin}/product/mouse`,
      metadata: {
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId,
      },
    },
    {
      // ✅ Actuar en nombre del vendedor (usuario A)
      stripeAccount: sellerAccountId,

      // ✅ Comisión para tu plataforma (1%)
      application_fee_amount: applicationFeeAmount,
    } as StripeConnectOptions
  );

  return NextResponse.json({ sessionId: session.id, url: session.url });
};