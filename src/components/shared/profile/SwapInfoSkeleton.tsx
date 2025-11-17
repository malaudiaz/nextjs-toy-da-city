// src/components/shared/profile/SwapInfoSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Asume que tienes un componente Skeleton

// Skeleton para una sola tarjeta de intercambio
const SwapCardSkeleton = () => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Skeleton para la imagen */}
        <div className="flex-shrink-0">
          <Skeleton className="rounded-lg w-full lg:w-[150px] h-[150px]" />
        </div>

        <div className="flex-1 space-y-4 pt-2">
          {/* Título */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-56 mb-2" /> {/* Título del juguete */}
            </div>
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Descripción y detalles */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" /> {/* Descripción línea 1 */}
            <Skeleton className="h-4 w-5/6" /> {/* Descripción línea 2 */}
            <div className="pt-2 space-y-1">
              <Skeleton className="h-4 w-40" /> {/* Categoría */}
              <Skeleton className="h-4 w-40" /> {/* Condición */}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton principal para la lista de intercambios
const SwapInfoSkeleton = () => {
  // Muestra 3 esqueletos
  const skeletonItems = Array.from({ length: 3 }); 

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48" /> {/* Título */}
        </div>

        <div className="space-y-6">
          {skeletonItems.map((_, index) => (
            <SwapCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwapInfoSkeleton;