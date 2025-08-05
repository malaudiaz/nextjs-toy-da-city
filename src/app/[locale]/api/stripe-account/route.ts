// app/api/stripe-account/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // Versión actualizada
  typescript: true,
  timeout: 10000, // 10 segundos de timeout
  maxNetworkRetries: 2, // Reintentos automáticos
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Asegurarse de que user.email es un string válido
    if (!user.email) {
      return NextResponse.json({ error: 'El usuario no tiene un correo electrónico' }, { status: 400 });
    }    

    // Crear cuenta de Stripe Connect
    const account = await stripe.accounts.create({
      type: 'express', // O 'standard' según tus necesidades
      email: user.email,
      metadata: { clerkId: userId },
    });

    // Actualizar usuario con stripeAccountId
    await prisma.user.update({
      where: { clerkId: userId },
      data: { stripeAccountId: account.id, role: 'seller' },
    });

    // Generar enlace de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-onboarding`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-dashboard`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ onboardingUrl: accountLink.url });
  } catch (error) {
    console.error('Error al crear cuenta de Stripe:', error);
    return NextResponse.json({ error: 'No se pudo crear cuenta de Stripe' }, { status: 500 });
  }
}