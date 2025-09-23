// components/ChatModal.tsx
"use client";

import { useState, useRef, useEffect } from "react"; // ← Añadimos useCallback
import { useUser } from "@clerk/nextjs";
import { Toy } from "@/types/toy";
import Image from "next/image";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import Pusher from "pusher-js";
import ModalPortal from "./profile/ModalPortal";

type Seller = {
  id: string;
  fullName: string;
  imageUrl: string;
  clerkId: string;
  email?: string | null;
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
  toy,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [forceRender, setForceRender] = useState(false); // ← Nuevo estado para forzar repaint

  const { user } = useUser();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null); // ← Nuevo ref

  // Cargar historial
  useEffect(() => {
    if (!isOpen || !currentUserId || !seller.id) return;

    const loadChat = async () => {
      try {
        const res = await fetch(`/api/chat/messages?with=${seller.clerkId}&toyId=${toy.id}`);
        const { messages } = await res.json();
        setMessages(messages);
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadChat();
  }, [isOpen, currentUserId, seller.clerkId, seller.id, toy.id]); // ← Añadidos seller.id y toy.id
  
  // Suscribirse a Pusher
  useEffect(() => {
    if (!isOpen || !currentUserId || !seller.id) return;

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

    try {
      channel.bind("pusher:subscription_error", (err: PusherSubscriptionError) => {
        console.error("❌ Error de suscripción:", err);
        // Opcional: enviar a tu sistema de logs (Sentry, etc.)
        // captureException(err);
      });
    } catch (error) {
      console.error("🚨 Error inesperado al bindear suscripción:", error);
      // ¡La app sigue corriendo!
    }

    channel.bind("new-message", (data: PusherMessageEvent) => {
      console.log("📩 Mensaje recibido:", data.message);
      setMessages((prev) => {
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
  }, [isOpen, currentUserId, seller.id]); // ← Añadimos isOpen

  // Enviar mensaje
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const outgoingMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId!,
      receiverId: seller.clerkId,
      createdAt: new Date(),
      sender: {
        clerkId: seller.clerkId!,
        name: user?.firstName ?? user?.lastName ?? "Usuario",
      },
      toyId: toy.id,
    };

    setMessages((prev) => [...prev, outgoingMessage]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: seller.clerkId,
          content,
          toyId: toy.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${res.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("💥 Error al enviar mensaje:", error.message);
        alert(`No se pudo enviar el mensaje: ${error.message}`);
      } else {
        console.error("💥 Error desconocido:", error);
        alert("No se pudo enviar el mensaje: error desconocido");
      }
      setMessages((prev) => prev.filter((m) => m.id !== outgoingMessage.id));
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isOpen]);

  // ✅ FORZAR REPAINT cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        setForceRender(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setForceRender(false);
      setIsLoaded(false); // Resetear cuando se cierra
    }
  }, [isOpen]);

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Si está cargando, mostramos un loader en portal
  if (!isLoaded) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700">Cargando chat...</p>
          </div>
        </div>
      </ModalPortal>
    );
  }

  // ✅ Renderizamos el modal solo si forceRender es true (evita render prematuro)
  if (!forceRender) {
    return null;
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          ref={modalContentRef}
          className="relative w-11/12 max-w-md rounded-lg bg-white shadow-xl"
        >
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

          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="flex-shrink-0">
              <Image
                src={
                  toy.media && toy.media[0]
                    ? toy.media[0].fileUrl
                    : "/placeholder.svg"
                }
                alt={toy.title || "Juguete"}
                width={80}
                height={80}
                className="rounded-lg object-cover w-full sm:w-[80px] h-[80px]"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {toy.price !== undefined && toy.price > 0
                    ? `$${toy.price.toFixed(2)}`
                    : "Gratis"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <p>{toy.title}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-gray-100">
            <div ref={scrollContainerRef} className="h-80 overflow-y-auto">
              <MessageList messages={messages} currentUserId={currentUserId} />
              <div ref={messagesEndRef} />
            </div>
          </div>

          <MessageInput onSend={sendMessage} />
        </div>
      </div>
    </ModalPortal>
  );
}
