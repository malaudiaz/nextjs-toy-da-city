"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import useSWR from "swr"; // 1. Importamos useSWR
import { MessageInput } from "@/components/shared/MessageInput";
import { MessageList } from "@/components/shared/MessageList";
import Pusher from "pusher-js";
import { useTranslations } from 'next-intl';

// Tipos
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date | string;
  sender: {
    clerkId: string;
    name: string | null;
    imageUrl?: string | null;
  };
  receiver: {
    clerkId: string;
    name: string | null;
    imageUrl?: string | null;
  };
  toyId: string;
}

type PusherMessageEvent = {
  message: Message;
};

// 2. Definimos el fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const t = useTranslations('reputation');
  const { userId: otherUserId } = React.use(params);
  const { user } = useUser();
  const currentUserId = user?.id;

  console.log("usuario clerk: ", user);
  alert("ID usuario actual: " + currentUserId);

  // 3. Reemplazamos el useState y useEffect de carga por useSWR
  // La key depende de currentUserId y otherUserId. Si faltan, es null (pausa).
  const swrKey = currentUserId && otherUserId 
    ? `/api/chat/messages?with=${otherUserId}` 
    : null;

  const { data, isLoading, mutate } = useSWR<{ messages: Message[] }>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false, // Opcional: evita recargas constantes al cambiar de pestaña
      fallbackData: { messages: [] } // Estado inicial seguro
    }
  );

  // Extraemos los mensajes de la data de SWR
  const messages = data?.messages || [];

  // ✅ Escuchar nuevos mensajes con Pusher
  // Mantenemos este useEffect porque es una suscripción (WebSocket), no un fetch.
  // Pero ahora actualizamos la caché de SWR con `mutate`.
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error("Faltan variables de entorno de Pusher");
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      authEndpoint: "/api/chat/pusher",
    });

    const channelName = `private-chat-${currentUserId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Suscripción exitosa al canal:", channelName);
    });

    channel.bind("new-message", (incoming: PusherMessageEvent) => {
      console.log("📩 Mensaje recibido:", incoming.message);
      
      // 4. Actualizamos SWR con el nuevo mensaje (sin revalidar con la API)
      mutate(
        (currentData) => {
          if (!currentData) return { messages: [incoming.message] };
          // Evitar duplicados
          if (currentData.messages.some(m => m.id === incoming.message.id)) {
            return currentData;
          }
          return {
            ...currentData,
            messages: [...currentData.messages, incoming.message],
          };
        },
        false // false = No hacer fetch a la API, confiamos en Pusher
      );
    });

    return () => {
      console.log("🧹 Desuscribiendo de:", channelName);
      channel.unsubscribe();
    };
  }, [currentUserId, otherUserId, mutate]); // Agregamos mutate a dependencias

  // ✅ Enviar mensaje (optimistic update con SWR)
  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !currentUserId) return;

    const outgoingMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId,
      receiverId: otherUserId,
      createdAt: new Date().toISOString(), // Mejor usar ISO string para consistencia
      sender: {
        clerkId: currentUserId,
        name: user.fullName || user.firstName || "Yo", // Tu nombre        
        imageUrl: user.imageUrl,
      },
      receiver: {
        clerkId: otherUserId,
        name: "Usuario",
        imageUrl: null
      },
      toyId: ""
    };

    // 5. Mutación optimista: actualizamos la UI inmediatamente
    mutate(
      (currentData) => ({
        messages: [...(currentData?.messages || []), outgoingMessage],
      }),
      false // No revalidar todavía
    );

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: otherUserId, content, toyId: "" }),
      });

      if (!res.ok) throw new Error("Error en la red");

      // Opcional: Podrías hacer mutate() sin argumentos aquí para
      // sincronizar con el servidor y obtener el ID real, 
      // pero si Pusher te envía tu propio mensaje de vuelta, 
      // la lógica del useEffect lo manejará.
      
    } catch (error) {
      console.error("Error al enviar:", error);
      alert(t('sendError'));
      
      // Revertir cambios en caso de error (borrar el mensaje temporal)
      mutate(
        (currentData) => ({
          messages: (currentData?.messages || []).filter(m => m.id !== outgoingMessage.id)
        }),
        false
      );
    }
  };

  // ✅ Loading state manejado por SWR
  // Nota: Si usas fallbackData, isLoading podría ser false desde el inicio,
  // pero si swrKey es null (no user), no cargará nada.
  if (isLoading && !data) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg overflow-hidden">
      <header className="bg-blue-600 text-white p-4">
        {t('title')}
      </header>
      <MessageList messages={messages} currentUserId={currentUserId!} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}