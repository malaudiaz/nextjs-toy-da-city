// components/ChatButton.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import useSWR from "swr";
import ChatModal from "./ChatModal";
import { Button } from "../ui/button";
import { Toy } from "@/types/toy";

type ChatButtonProps = {
  toy: Toy;
  seller: {
    id: string;
    fullName: string;
    imageUrl: string;
    clerkId: string;
    email?: string | null;
    reputation?: number;
    reviews?: number;
  } | null;
};

// Fetcher para SWR
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  }).then((res) => res.json());

export function ChatButton({ toy, seller }: ChatButtonProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCurrentUser = user?.id === seller?.id;

  // Solo hacemos la petición si NO es el usuario actual y el seller existe
  const { data, error, isLoading } = useSWR(
    !isCurrentUser && seller?.id ? `/api/presence/${seller.id}` : null,
    fetcher,
    {
      refreshInterval: 15_000, // ← Revalida cada 15 segundos (reemplaza setInterval)
      revalidateOnFocus: false, // Opcional: no revalidar al volver al tab
      revalidateOnReconnect: true,
    }
  );

  const online = data?.online ?? false;
  const loading = isLoading;
  const hasError = error;

  const handleClick = () => {
    if (!isCurrentUser) {
      setIsModalOpen(true);
    }
  };

  // Habilitar botón solo si:
  // - No es el usuario actual
  // - Ya cargó la presencia (o falló, pero al menos terminó de cargar)
  const isEnabled = !isCurrentUser && !loading;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        onClick={handleClick}
        disabled={!isEnabled}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Cargando...
          </span>
        ) : hasError ? (
          "Chat (offline)"
        ) : online ? (
          "Chat (online)"
        ) : (
          "Chat"
        )}
      </Button>

      {/* Modal del chat */}
      <ChatModal
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        seller={seller!}
        currentUserId={user ? user.id! : ""}
        toy={toy}
      />
    </>
  );
}