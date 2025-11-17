// src/components/config/ToyGridSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Asume que tienes un componente Skeleton (shadcn/ui o similar)

// Componente Skeleton para una sola tarjeta (imita a ToyCard)
const ToyCardSkeleton = () => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
    <CardContent>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Skeleton para la imagen */}
        <div className="flex-shrink-0">
          <Skeleton className="rounded-lg w-full lg:w-[150px] h-[150px]" />
        </div>

        <div className="flex-1 space-y-4 pt-2">
          {/* Skeleton para título y precio */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Título */}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-8 w-20" /> {/* Precio */}
            </div>
          </div>

          {/* Skeleton para descripción */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />

          {/* Skeleton para botones */}
          <div className="flex flex-row gap-4 pt-2">
            <Skeleton className="h-10 w-20" /> {/* Botón Editar */}
            <Skeleton className="h-10 w-20" /> {/* Botón Eliminar */}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente Skeleton principal (imita a ToyGrid)
const ToyGridSkeleton = () => {
  // Muestra 3-5 esqueletos para simular la carga inicial
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 pl-4 pb-4">
          <Skeleton className="h-10 w-64" /> 
        </div>

        <div className="space-y-6">
          {skeletonItems.map((_, index) => (
            <ToyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToyGridSkeleton;