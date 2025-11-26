"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr"; // 1. Importa useSWR

// Función fetcher global para useSWR
// useSWR requiere una función para manejar la lógica de fetching.
// Esta función será llamada por useSWR con la 'key' si no es null.
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    // Si la API falla, lanzamos un error que useSWR capturará
    const errorText = await res.text();
    throw new Error(`Failed to fetch presence: ${res.status} ${errorText}`);
  }

  return res.json();
};

export function UserAvatar({
  userId,
  src,
  alt,
}: {
  userId: string;
  src: string;
  alt: string;
}) {
  const { isLoaded, isSignedIn } = useUser();
  
  // 2. Define la 'key' de SWR. Será la URL de la API.
  // La key se establece a `null` si el usuario no está autenticado,
  // lo que evita que useSWR ejecute el fetcher.
  const apiPath = `/api/presence/${encodeURIComponent(userId)}`;
  const swrKey = isLoaded && isSignedIn ? apiPath : null;

  // 3. Usa useSWR.
  const { data, error, isLoading } = useSWR(
    swrKey, 
    fetcher, 
    {
        // 4. Configura el revalidado automático, reemplazando el setInterval.
        // revalidateOnFocus: true, // Opcional: Revalidar al enfocar la ventana
        refreshInterval: 10_000, // Revalidar cada 10 segundos
    }
  );

  // 5. Determina el estado de 'online' basado en SWR
  let onlineState: boolean | null = null;
  
  if (isLoading || !isLoaded) {
    // Estado inicial, o esperando la respuesta de Clerk
    onlineState = null; 
  } else if (error) {
    // Hubo un error en el fetcher (incluye cuando swrKey es null y no hay datos)
    console.error("Presence check failed via SWR:", error);
    onlineState = false; // Asume offline en caso de error
  } else if (data) {
    // Datos recibidos correctamente
    onlineState = data.online ?? false;
  } else if (!isSignedIn) {
    // Clerk cargó, no está autenticado, y swrKey fue null (no se hizo el fetch)
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
    </div>
  );
}