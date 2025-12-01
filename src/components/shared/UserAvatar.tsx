"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch presence: ${res.status} ${errorText}`);
  }

  return res.json();
};

export function UserAvatar({
  userId,
  src,
  alt,
  showStatus = true,
}: {
  userId: string;
  src: string;
  alt: string;
  showStatus?: boolean;
}) {
  const { isLoaded, isSignedIn } = useUser(); 
  const apiPath = `/api/presence/${encodeURIComponent(userId)}`;
  const swrKey = (isLoaded && isSignedIn && showStatus) ? apiPath : null;
  const { data, error, isLoading } = useSWR(
    swrKey, 
    fetcher, 
    {
        refreshInterval: 10_000, 
    }
  );

  let onlineState: boolean | null = null;
  
  if (isLoading || !isLoaded) {
    onlineState = null; 
  } else if (error) {
    console.error("Presence check failed via SWR:", error);
    onlineState = false; 
  } else if (data) {
    onlineState = data.online ?? false;
  } else if (!isSignedIn || !showStatus) {
    // Si no está logueado O si desactivamos el status, asumimos estado inactivo/null
    onlineState = false;
  }

  return (
    <div className="flex flex-col gap-0.5 items-center space-y-1">
      {/* Avatar */}
      <div className="flex flex-row h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-red">
        <Image
          src={src || "/no-image.png"}
          alt={alt || ""}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Estado: online / offline */}
      {/* Al ser showStatus false, este bloque no se renderiza, 
          y gracias al cambio arriba, tampoco se hace el fetch */}
      {showStatus && (
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
          {onlineState === null ? "..." : onlineState ? "online" : "offline"}
        </span>
      )}
    </div>
  );
}