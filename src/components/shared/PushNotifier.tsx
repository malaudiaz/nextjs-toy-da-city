"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

// ✅ Convierte base64 URL-safe a Uint8Array (requerido por Firefox)
function urlB64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array(
    Array.from({ length: rawData.length }, (_, i) => rawData.charCodeAt(i))
  );
}

// 🎯 Esta función hará la suscripción y devolverá un valor (true o error)
const subscribeToPushNotifications = async (userId: string) => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker no soportado");
  }

  try {
    // ✅ Registrar Service Worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("✅ SW registrado:", registration.scope);

    // ✅ Verificar permiso antes de pedir
    if (Notification.permission === "denied") {
      console.log("❌ Notificaciones bloqueadas por el usuario");
      return { success: false, permission: "denied" };
    }

    // ✅ Pedir permiso
    const permission = await Notification.requestPermission();
    console.log("🔐 Permiso solicitado:", permission);

    if (permission !== "granted") {
      console.log(`Permiso no concedido: ${permission}`);
      return { success: false, permission };
    }

    // ✅ Verificar si ya está suscrito
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.log("✅ Ya suscrito:", subscription.endpoint);
      return { success: true, alreadySubscribed: true, subscription };
    }

    // ✅ Suscribirse (con conversión de VAPID key)
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    console.log("✅ Suscrito:", subscription.endpoint);

    // ✅ Enviar al backend
    const res = await fetch("/api/chat/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...subscription.toJSON(), // 👈 Serializa correctamente la suscripción
        userId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: errorText };
    }

    console.log("✅ Suscripción guardada en el servidor");
    return { success: true, subscription };
  } catch (error) {
    console.error("Error al suscribirse a notificaciones:", error);
    throw error; // SWR capturará esto como error
  }
};

// Este componente se encarga de pedir permiso y registrar la suscripción a notificaciones push
export function PushNotifier() {
  const { userId } = useAuth();

  // Solo ejecutamos SWR si hay userId
  useSWR(
    userId ? ["push-subscribe", userId] : null, // clave única por usuario
    () => subscribeToPushNotifications(userId!),
    {
      revalidateOnFocus: false, // No revalidar al volver al foco
      revalidateOnReconnect: false, // No revalidar al reconectar
      refreshInterval: 0, // Sin refresco automático
      shouldRetryOnError: true, // Reintentar si falla
      errorRetryCount: 3, // Máximo 3 reintentos
      onError: (err) => {
        console.error("❌ SWR: Error en suscripción push:", err.message);
      },
    }
  );

  return null; // Este componente no renderiza nada
}
