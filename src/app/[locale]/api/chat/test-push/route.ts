import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WebPushError } from "web-push";
import webPush from '@/lib/webpush' // ← Usa el configurado
import { getTranslations } from "next-intl/server";


export async function GET() {
  const { userId } = await auth();
  const g = await getTranslations("General.errors");
  
  if (!userId)
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: g("UserNotFound") },
      { status: 404 }
    );
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: user.id },
  });

  if (subscriptions.length === 0) {
    return NextResponse.json(
      { error: g("NoPushSubscriptionsFound") },
      { status: 404 }
    );
  }

  let sent = 0;
  for (const sub of subscriptions) {
    // ✅ === LOGS DE DEPURACIÓN ===
    console.log('🔍 Depuración de notificación push:')
    console.log('🔑 VAPID Public Key (inicio):', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.substring(0, 15))
    console.log('🔐 VAPID Private Key configurada:', !!process.env.VAPID_PRIVATE_KEY ? 'Sí' : 'NO CONFIGURADA')
    console.log('📡 Endpoint:', sub.endpoint)
    console.log('📋 Subscription ID:', sub.id)
    console.log('👤 Enviando a userId:', user.id)
    // === FIN DE LOGS ===

    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        },
        JSON.stringify({
          title: "🎉 Notificación de prueba",
          body: "Si ves esto, web push funciona perfecto!",
          icon: "/icon.png",
          data: { url: "/chat" },
        })
      );
      sent++;
    } catch (error) {
      if (error instanceof WebPushError) {
        
        console.error('🔴 WebPushError detallado:', {
          statusCode: error.statusCode,
          header: error.headers?.authorization?.substring(0, 30), // primeros caracteres
          body: error.body,
          endpoint: sub.endpoint,
        })


        if (error.statusCode === 410 || error.statusCode === 404) {
          // Suscripción expirada o no válida → eliminar de la DB
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error("WebPush error:", error.statusCode, error.body);
        }
      } else {
        // Error inesperado (red, etc.)
        console.error("Unexpected error sending push:", error);
      }
    }
  }

  return NextResponse.json({ sent: `${sent} notificación(es) enviada(s)` });
}
