// components/ChatButton.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import ChatModal from "./ChatModal";
import { Button } from "../ui/button";
import { Toy } from "@/types/toy";


type ChatButtonProps = {
  toy: Toy;
  seller: {
    id: string;
    fullName: string;
    imageUrl: string;
    reputation?: number;
    reviews?: number;
  } | null;
};


export function ChatButton({ toy, seller }: ChatButtonProps) {
  const { user } = useUser();
  const [online, setOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCurrentUser = user?.id === seller?.id

  useEffect(() => {
    if (isCurrentUser) {
      setLoading(false);
      return;
    }

    const checkPresence = async () => {
      try {
        const res = await fetch(`/api/presence/${seller?.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const data = await res.json();
        setOnline(data.online);
      } catch (error) {
        console.error("Error checking presence:", error);
        setOnline(false);
      } finally {
        setLoading(false);
      }
    };

    checkPresence();
    const interval = setInterval(checkPresence, 15_000);
    return () => clearInterval(interval);
  }, [seller, isCurrentUser]);

  const handleClick = () => {
    if (online && !isCurrentUser) {
      setIsModalOpen(true);
    }
  };

  let isEnabled = false;

  if (!loading) {
    isEnabled = (!isCurrentUser) === true;
  }

  return (
    <>

        <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            onClick={handleClick}
            disabled={!isEnabled}
        >
            Chat
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