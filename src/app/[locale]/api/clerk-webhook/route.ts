// app/api/clerk-webhook/route.ts
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getTranslations } from "next-intl/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

export async function POST(req: Request) {

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const g = await getTranslations("General");
  const t = await getTranslations("User");

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: g("WebhookNotConfigure") },
      { status: 400 }
    );
  }

  // Obtener headers directamente desde req.headers
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: g("MissingHeadersSvix") }, { status: 400 });
  }

  // Verificar webhook
  const payload = await req.json();

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Verificación de webhook fallida:", err);
    return NextResponse.json(
      { error: g("WebhookSignInvalid") },
      { status: 400 }
    );
  }

  // Manejar creación de usuario
  if (payload.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = payload.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return NextResponse.json(
        { error: t("UserWithoutEmail") },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        // Crear cuenta de Stripe Connect (Express)
        const account = await stripe.accounts.create({
          type: "express",
          email,
          metadata: { clerkId: id }, // Asocia el ID de Clerk para referencia
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });

        // Opcional: Crear un enlace de onboarding para que el vendedor complete su cuenta
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/seller-onboarding`,
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/seller-dashboard`,
          type: "account_onboarding",
        });

        // Guardar usuario en la base de datos
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            name: `${first_name} ${last_name}`.trim() || email,
            stripeAccountId: account.id,
            onboardingUrl: accountLink.url,
            role: "buyer",
          },
        });

        console.log("Usuario y cuenta de Stripe creados:", {
          clerkId: id,
          email,
          stripeAccountId: account.id,
        });
      }
    } catch (error) {
      console.error("Error al guardar usuario en la base de datos:", error);
      return NextResponse.json(
        { error: t("UpdateError") },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook procesado" }, { status: 200 });
}
