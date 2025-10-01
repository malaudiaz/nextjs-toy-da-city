"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function UserAvatar({
  userId,
  src,
  alt,
}: {
  userId: string;
  src: string;
  alt: string;
}) {
  const [online, setOnline] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    // ✅ Validación: aseguramos que userId sea una cadena no vacía
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.warn("UserAvatar: userId is invalid or missing");
      setOnline(false);
      return;
    }

    const checkPresence = async () => {
      try {
        const res = await fetch(`/api/presence/${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn(
            `Presence API failed for user ${userId}: ${res.status} ${res.statusText}`
          );
          throw new Error("Failed to fetch user presence");
        }

        const data = await res.json();
        setOnline(data.online ?? false); // fallback por si falta la propiedad
      } catch (error) {
        console.error("Presence check failed:", error);
        setOnline(false); // default: offline
      }
    };

    // Ejecutar inmediatamente
    checkPresence();

    // Repetir cada 10 segundos
    const interval = setInterval(checkPresence, 10_000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="flex flex-col gap-0.5 items-center space-y-1">
      {/* Avatar */}
      <div className="flex flex-row h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-red">
        <Image
          src={src || "/no-image.png"}
          alt={alt}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Estado: online / offline */}
      <span
        className="
          whitespace-nowrap 
          px-2 
          py-0.5 
          text-xs 
          font-medium 
          rounded-full 
          border 
          bg-white 
          text-black
          border-gray-300
          shadow-sm
          transition-all
        "
        style={{
          lineHeight: "1rem",
          display: "inline-block",
          minWidth: "40px",
          textAlign: "center",
        }}
      >
        {online === null ? "..." : online ? "online" : "offline"}
      </span>
    </div>
  );
}
