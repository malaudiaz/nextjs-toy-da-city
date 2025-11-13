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

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Interface para errores de operación
interface OperationError {
  message: string;
  code?: string;
  stack?: string;
}

// Interfaces para el payload de Clerk
interface ClerkEmail {
  email_address: string;
}

interface ClerkMetadata {
  locale?: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmail[];
  first_name?: string;
  last_name?: string;
  unsafe_metadata?: ClerkMetadata;
  public_metadata?: ClerkMetadata;
  private_metadata?: ClerkMetadata;
}

interface ClerkWebhookPayload {
  type: string;
  data: ClerkUserData;
}

interface LocaleUrls {
  locale: string;
  refreshUrl: string;
  returnUrl: string;
}

// Función con reintentos automáticos y tipos específicos
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: OperationError | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Convertir error a nuestro tipo OperationError
      const operationError: OperationError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: (error as { code?: string }).code,
        stack: error instanceof Error ? error.stack : undefined
      };
      
      lastError = operationError;
      console.warn(`Intento ${attempt} fallido:`, operationError.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => 
          setTimeout(resolve, RETRY_DELAY * attempt)
        );
      }
    }
  }
  
  throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Función para obtener el locale y construir URLs
function getLocaleAndUrls(payload: ClerkWebhookPayload): LocaleUrls {
  // Obtener el locale del usuario desde Clerk
  // Puede estar en diferentes ubicaciones dependiendo del evento
  let locale = 'en'; // valor por defecto
  
  const metadataSources = [
    payload.data.unsafe_metadata,
    payload.data.public_metadata,
    payload.data.private_metadata
  ];
  
  for (const metadata of metadataSources) {
    if (metadata?.locale) {
      locale = metadata.locale;
      break;
    }
  }
  
  // Validar que el locale sea soportado
  const supportedLocales = ['en', 'es'];
  if (!supportedLocales.includes(locale)) {
    locale = 'en'; // fallback a inglés
  }
  
  // Construir URLs basadas en el locale
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const refreshUrl = `${baseUrl}/${locale}/seller-onboarding`;
  const returnUrl = `${baseUrl}/${locale}/seller-dashboard`;
  
  return {
    locale,
    refreshUrl,
    returnUrl
  };
}

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

  // Obtener headers
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: g("MissingHeadersSvix") }, 
      { status: 400 }
    );
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

  // Manejar creación de usuario con reintentos
  if (payload.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = payload.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error("Usuario sin email:", id);
      return NextResponse.json(
        { error: t("UserWithoutEmail") },
        { status: 400 }
      );
    }

    try {
      // Verificar si el usuario ya existe con reintentos
      const existingUser = await retryOperation(() =>
        prisma.user.findUnique({
          where: { email: email },
        })
      );

      if (existingUser) {
        console.log("Usuario ya existe en la base de datos:", email);
        return NextResponse.json(
          { message: "Usuario ya existe" },
          { status: 200 }
        );
      }

      // Obtener locale y URLs dinámicas
      const { refreshUrl, returnUrl } = getLocaleAndUrls(payload);

      // Crear cuenta de Stripe con reintentos
      const account = await retryOperation(() =>
        stripe.accounts.create({
          type: "express",
          email,
          metadata: { clerkId: id },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        })
      );

      // Crear account link con reintentos
      const accountLink = await retryOperation(() =>
        stripe.accountLinks.create({
          account: account.id,
          refresh_url: refreshUrl,
          return_url: returnUrl,
          type: "account_onboarding",
        })
      );

      // Guardar usuario en la base de datos con reintentos
      await retryOperation(() =>
        prisma.user.create({
          data: {
            clerkId: id,
            email,
            name: `${first_name} ${last_name}`.trim() || email,
            stripeAccountId: account.id,
            onboardingUrl: accountLink.url,
            role: "buyer",
          },
        })
      );

      console.log("✅ Usuario y cuenta de Stripe creados exitosamente:", {
        clerkId: id,
        email,
        stripeAccountId: account.id,
      });

    } catch (error) {
      console.error("❌ Error crítico después de todos los reintentos:", error);
      
      // Manejar el error de forma segura sin usar 'any'
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Guardar en log de errores críticos
      try {
        await prisma.webhookError.create({
          data: {
            clerkId: id,
            email: email,
            errorType: 'CRITICAL_FAILURE',
            errorMessage: errorMessage,
            payload: JSON.stringify(payload.data)
          }
        });
      } catch (dbError) {
        console.error("Error al guardar en log:", dbError);
      }

      return NextResponse.json(
        { 
          error: t("UpdateError"),
          details: "El registro falló después de múltiples intentos"
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "Webhook procesado exitosamente" }, 
    { status: 200 }
  );
}