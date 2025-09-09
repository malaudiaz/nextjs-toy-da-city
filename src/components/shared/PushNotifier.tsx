"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

// ✅ Convierte base64 URL-safe a Uint8Array (requerido por Firefox)
function urlB64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = atob(base64)
  return new Uint8Array(
    Array.from({ length: rawData.length }, (_, i) => rawData.charCodeAt(i))
  )
}

// Este componente se encarga de pedir permiso y registrar la suscripción a notificaciones push
export function PushNotifier() {
  const { userId } = useAuth();

  useEffect(() => {
    console.log("PushNotifier ejecutado", { userId });

    if (!userId || !("serviceWorker" in navigator)) return;

    const subscribeToPush = async () => {
      try {
        // ✅ Registrar Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('✅ SW registrado:', registration.scope)

        // ✅ Verificar permiso antes de pedir
        if (Notification.permission === 'denied') {
          console.warn('❌ Notificaciones bloqueadas por el usuario')
          return
        }

        // ✅ Pedir permiso
        const permission = await Notification.requestPermission()
        console.log('🔐 Permiso solicitado:', permission)

        if (permission !== 'granted') {
          console.log('❌ Permiso no concedido:', permission)
          return
        }

        // ✅ Verificar si ya está suscrito
        let subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          console.log('✅ Ya suscrito:', subscription.endpoint)
          return
        }

        // ✅ Suscribirse (con conversión de VAPID key)
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        })

        console.log('✅ Suscrito:', subscription.endpoint)

        // ✅ Enviar al backend
        const res = await fetch('/api/chat/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })

        if (res.ok) {
          console.log('✅ Suscripción guardada en el servidor')
        } else {
          const error = await res.text()
          console.error('❌ Error al guardar suscripción:', error)
        }
      } catch (error) {
        console.error("Error al suscribirse a notificaciones:", error);
      }
    };

    // Ejecutar solo en el cliente y si hay usuario autenticado
    subscribeToPush();
  }, [userId]);

  return null; // Este componente no renderiza nada
}
