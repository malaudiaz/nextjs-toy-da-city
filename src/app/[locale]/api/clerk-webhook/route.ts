// app/api/clerk-webhook/route.ts
import { Webhook } from 'svix';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // Versión actualizada
  typescript: true,
  timeout: 10000, // 10 segundos de timeout
  maxNetworkRetries: 2, // Reintentos automáticos
});

export async function POST(req: Request) {
  console.log('Webhook recibido. URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Secreto de webhook no configurado' }, { status: 400 });
  }

  // Obtener headers directamente desde req.headers
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Faltan headers svix' }, { status: 400 });
  }

  // Verificar webhook
  const payload = await req.json();

  console.log('Payload:', payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    wh.verify(JSON.stringify(payload), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Verificación de webhook fallida:', err);
    return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 });
  }

  // Manejar creación de usuario
  if (payload.type === 'user.created') {
    const { id, email_addresses, username } = payload.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return NextResponse.json({ error: 'El usuario no tiene un correo electrónico' }, { status: 400 });
    }

    try {
      // Crear cuenta de Stripe Connect (Express)
      const account = await stripe.accounts.create({
        type: 'express',
        email,
        metadata: { clerkId: id }, // Asocia el ID de Clerk para referencia
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      // Guardar usuario en la base de datos
      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name: `${username}`.trim() || email,
          stripeAccountId: account.id,
          role: 'buyer',
        },
      });

      console.log('Usuario y cuenta de Stripe creados:', { clerkId: id, email, stripeAccountId: account.id });

      // Opcional: Crear un enlace de onboarding para que el vendedor complete su cuenta
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-onboarding`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/seller-dashboard`,
        type: 'account_onboarding',
      });

      console.log('Enlace de onboarding generado:', accountLink.url);      

    } catch (error) {
      console.error('Error al guardar usuario en la base de datos:', error);
      return NextResponse.json({ error: 'No se pudo guardar usuario' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook procesado' }, { status: 200 });
}