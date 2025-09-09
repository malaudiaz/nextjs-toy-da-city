"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import { useEffect, useState } from "react";
import { MessageInput } from "@/components/shared/MessageInput";
import { MessageList } from "@/components/shared/MessageList";
import Pusher from "pusher-js";

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
  };
}

/* interface ChatUser {
  id: string;
  name: string;
  email?: string | null;
  imageUrl?: string | null;
}
 */

type PusherMessageEvent = {
  message: Message;
};

type PusherSubscriptionError = {
  type: string
  error?: string
  status?: number
  body?: string
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  // ✅ Desempaqueta params
  const { userId: otherUserId } = React.use(params);

  // ✅ Obtiene el ID del usuario autenticado
  const { user } = useUser();
  const currentUserId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  //const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ Evita renderizar antes de estar listo

  // ✅ Cargar historial cuando otherUserId esté disponible
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const loadChat = async () => {
      try {
        // 1. Cargar mensajes
        const res = await fetch(`/api/chat/messages?with=${otherUserId}`);
        const { messages } = await res.json();
        setMessages(messages);

        // 2. Cargar datos del otro usuario

/*         const userRes = await fetch(`/api/users/${otherUserId}`);
        const user = await userRes.json();
        setOtherUser(user);
 */
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoaded(true); // ✅ Indica que todo está cargado
      }
    };

    loadChat();
  }, [currentUserId, otherUserId]); // ✅ Se ejecuta cuando cambia el chat

  // ✅ Escuchar nuevos mensajes con Pusher
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    console.log("👤 currentUserId:", currentUserId); // ✅ ¿Es el ID correcto, es el id de clerk?

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

    console.log("🎧 Intentando suscribirse a:", channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Suscripción exitosa al canal:", channelName);
    });

    channel.bind("pusher:subscription_error", (err: PusherSubscriptionError) => {
      console.error("❌ Error de suscripción:", err);
    });

    channel.bind("new-message", (data: PusherMessageEvent) => {
      console.log("📩 Mensaje recibido:", data.message); // ✅ Depuración

      setMessages((prev) => {
        // ✅ Evita duplicados
        if (prev.some((m) => m.id === data.message.id)) {
          return prev;
        }
        return [...prev, data.message];
      });
    });

    return () => {
      console.log("🧹 Desuscribiendo de:", channelName);
      channel.unsubscribe();
    };
  }, [currentUserId, otherUserId]); // ✅ Ahora incluye ambos

  // ✅ Enviar mensaje (optimistic)
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const outgoingMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId!,
      receiverId: otherUserId,
      createdAt: new Date(),
      sender: {
        clerkId: currentUserId!,
        name: user?.firstName ?? user?.lastName ?? "Usuario",
      }
    };

    setMessages((prev) => [...prev, outgoingMessage]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: otherUserId, content }),
      });

      if (!res.ok) throw new Error("Error en la red");

      // ✅ Éxito: el mensaje ya está en el estado
    } catch (error) {
      console.error("Error al enviar:", error);
      setMessages((prev) => prev.filter((m) => m.id !== outgoingMessage.id));
      alert("No se pudo enviar el mensaje");
    }
  };

  // ✅ Evita renderizar antes de tener datos
  if (!isLoaded) {
    return <div>Cargando chat...</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg overflow-hidden">
      <header className="bg-blue-600 text-white p-4">
        Chat con 
      </header>
      <MessageList messages={messages} currentUserId={currentUserId!} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
