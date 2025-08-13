// app/api/stripe-account/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true, stripeAccountId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Asegurarse de que user.email es un string válido
    if (!user.email) {
      return NextResponse.json(
        { error: 'El usuario no tiene un correo electrónico' },
        { status: 400 }
      );
    }

    let stripeAccountId = user.stripeAccountId;

    // Si no hay stripeAccountId, crear una nueva cuenta de Stripe Connect
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        metadata: { clerkId: userId },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });


      stripeAccountId = account.id;

    }

    // Actualizar usuario con stripeAccountId
    await prisma.user.update({
      where: { clerkId: userId },
      data: { stripeAccountId, role: 'seller' },
    });

    // Generar enlace de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-onboarding`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-dashboard`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ onboardingUrl: accountLink.url });
  } catch (error) {
    console.error('Error al procesar la cuenta de Stripe:', error);
    return NextResponse.json(
      { error: 'No se pudo procesar la cuenta de Stripe' },
      { status: 500 }
    );
  }
}