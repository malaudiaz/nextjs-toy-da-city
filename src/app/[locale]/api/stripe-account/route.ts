// app/api/stripe-account/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname; // ej. "/es/api/stripe-account"
  const locale = pathname.split("/")[1]; // obtiene "es", "en", etc.

  const { userId } = await req.json();

  if (!userId || !locale) {
    return NextResponse.json(
      { error: "Faltan parámetros requeridos" },
      { status: 400 }
    );
  }

  try {
    // 1. Obtener usuario con transacción implícita (Prisma ya maneja esto bien)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true, stripeAccountId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "El usuario no tiene un correo electrónico" },
        { status: 400 }
      );
    }

    let stripeAccountId = user.stripeAccountId;

    // 2. Si no tiene cuenta, créala (con protección contra duplicados)
    if (!stripeAccountId) {
      // Usa una transacción o al menos un bloque atómico lógico
      // Prisma no soporta transacciones explícitas con find + update fácilmente,
      // así que usamos un enfoque defensivo: intentar crear, y si falla por duplicado, recuperar.
      try {
        const account = await stripe.accounts.create({
          type: "express",
          email: user.email,
          metadata: { clerkId: userId },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          // 👇 Añade el país si lo conoces (mejora la experiencia de onboarding)
          // country: 'US', // o dinámico según tu app
        });

        // Guardar en DB
        await prisma.user.update({
          where: { clerkId: userId },
          data: { stripeAccountId: account.id, role: "seller" },
        });

        stripeAccountId = account.id;
      } catch (error: unknown) {
        // Type guard para detectar errores de Stripe con code = 'account_already_exists'
        const isStripeAccountExistsError = (err: unknown): boolean => {
          return (
            err instanceof Error &&
            "type" in err &&
            err.type === "StripeInvalidRequestError" &&
            "raw" in err &&
            typeof err.raw === "object" &&
            err.raw !== null &&
            "code" in err.raw &&
            err.raw.code === "account_already_exists"
          );
        };

        if (isStripeAccountExistsError(error)) {
          console.warn(
            "Stripe reportó: cuenta ya existe. Reintentando desde base de datos..."
          );

          const updatedUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { stripeAccountId: true },
          });

          if (updatedUser?.stripeAccountId) {
            stripeAccountId = updatedUser.stripeAccountId;
          } else {
            throw new Error(
              "No se encontró la cuenta de Stripe en la base de datos tras el error de duplicado"
            );
          }
        } else {
          throw error;
        }
      }
    }

    // 3. Verificar si la cuenta ya está lista
    const account = await stripe.accounts.retrieve(stripeAccountId);

    if (account.charges_enabled && account.payouts_enabled) {
      // Ya completó el onboarding → redirigir directamente al dashboard

      return NextResponse.json({
        onboardingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
        status: "complete",
      });
    }

    // 4. Generar enlace de onboarding solo si es necesario
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/seller-onboarding?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      onboardingUrl: accountLink.url,
      status: "incomplete",
    });
  } catch (error: unknown) {
    console.error("Error al procesar la cuenta de Stripe:", error);

    // Extraer el mensaje de forma segura
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Error desconocido";

    return NextResponse.json(
      { error: `No se pudo procesar la cuenta de Stripe: ${errorMessage}` },
      { status: 500 }
    );
  }
}
