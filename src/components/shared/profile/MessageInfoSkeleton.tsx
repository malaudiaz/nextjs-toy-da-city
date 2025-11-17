// src/components/shared/profile/MessageInfoSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Asume que tienes un componente Skeleton

// Skeleton para una sola tarjeta de mensaje (imita a una tarjeta en MessageInfo)
const MessageCardSkeleton = () => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Skeleton para la imagen del juguete */}
        <div className="flex-shrink-0">
          <Skeleton className="rounded-lg w-full lg:w-[150px] h-[150px]" />
        </div>

        <div className="flex-1 space-y-4 pt-2">
          {/* Título y precio */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-56 mb-2" /> {/* Título del juguete */}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-8 w-24 rounded-lg" /> {/* Precio/Gratis */}
            </div>
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" /> 
            <Skeleton className="h-4 w-5/6" /> 
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Mensajes/Remitentes (imita la sección de compradores y botón de chat) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" /> {/* Nombre del comprador */}
                <Skeleton className="h-10 w-24" /> {/* Botón de Chat */}
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" /> {/* Nombre del comprador 2 */}
                <Skeleton className="h-10 w-24" /> {/* Botón de Chat 2 */}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton principal para la lista de mensajes
const MessageInfoSkeleton = () => {
  // Muestra 2 esqueletos, ya que la lista de mensajes podría ser más corta
  const skeletonItems = Array.from({ length: 2 }); 

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48" /> {/* Título */}
        </div>

        <div className="space-y-6">
          {skeletonItems.map((_, index) => (
            <MessageCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageInfoSkeleton;