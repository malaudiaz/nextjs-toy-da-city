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

  console.log(userId, src, alt);

  const [online, setOnline] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkPresence = async () => {
      try {
        const res = await fetch(`/api/presence/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setOnline(data.online);
      } catch (error) {
        console.error("Presence check failed:", error);
        setOnline(false); // Default to offline
      }
    };

    checkPresence();
    const interval = setInterval(checkPresence, 10_000);
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
          //fontSize: "0.75rem", // Fuerza tamaño pequeño
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
