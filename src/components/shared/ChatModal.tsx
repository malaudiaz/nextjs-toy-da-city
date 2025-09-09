// components/ChatModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Toy } from "@/types/toy";
import Image from "next/image";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import Pusher from "pusher-js";

type Seller = {
    id: string;
    fullName: string;
    imageUrl: string;
    reputation?: number;
    reviews?: number;
};


interface ChatModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  seller: Seller;
  currentUserId: string;
  toy: Toy;
}

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
  toyId: string;
}

type PusherMessageEvent = {
  message: Message;
};

type PusherSubscriptionError = {
  type: string;
  error?: string;
  status?: number;
  body?: string;
};

export default function ChatModal({
  isOpen,
  onCloseAction,
  seller,
  currentUserId,
  toy
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ Evita renderizar antes de estar listo

  const { user } = useUser();

  //const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Cargar historial cuando otherUserId esté disponible
  useEffect(() => {
    if (!currentUserId || !seller.id) return;

    const loadChat = async () => {
      try {
        // 1. Cargar mensajes
        const res = await fetch(`/api/chat/messages?with=${seller.id}`);
        const { messages } = await res.json();
        setMessages(messages);

      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoaded(true); // ✅ Indica que todo está cargado
      }
    };

    loadChat();
  }, [currentUserId, seller.id]); // ✅ Se ejecuta cuando cambia el chat

  // ✅ Escuchar nuevos mensajes con Pusher
  useEffect(() => {
    if (!currentUserId || !seller.id) return;

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

    channel.bind(
      "pusher:subscription_error",
      (err: PusherSubscriptionError) => {
        console.error("❌ Error de suscripción:", err);
      }
    );

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
  }, [currentUserId, seller.id]); // ✅ Ahora incluye ambos

  // ✅ Enviar mensaje (optimistic)
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const outgoingMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId!,
      receiverId: seller.id,
      createdAt: new Date(),
      sender: {
        clerkId: seller.id!,
        name: user?.firstName ?? user?.lastName ?? "Usuario",
      },
      toyId: toy.id,
    };

    setMessages((prev) => [...prev, outgoingMessage]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: seller.id, content, toyId: toy.id }),
      });

      if (!res.ok) throw new Error("Error en la red");

      // ✅ Éxito: el mensaje ya está en el estado
    } catch (error) {
      console.error("Error al enviar:", error);
      setMessages((prev) => prev.filter((m) => m.id !== outgoingMessage.id));
      alert("No se pudo enviar el mensaje");
    }
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  if (!isOpen) return null;

  // ✅ Evita renderizar antes de tener datos
  if (!isLoaded) {
    return <div>Cargando chat...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-11/12 max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Chat con {seller.fullName}
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <div className="flex-shrink-0">
            <Image
              src={toy.media[0].fileUrl || "/placeholder.svg"}
              alt={toy.title}
              width={80}
              height={80}
              className="rounded-lg object-cover w-full sm:w-[80px] h-[80px]"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {toy.price.toFixed(2) !== "0.00"
                  ? "$" + toy.price.toFixed(2)
                  : "Gratis"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <p>{toy.description}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <div
            ref={scrollContainerRef}
            className="h-[500px] overflow-y-auto bg-white"
          >
            <MessageList messages={messages} currentUserId={currentUserId!} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
