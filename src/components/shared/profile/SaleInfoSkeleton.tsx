// src/components/shared/profile/SaleInfoSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Asume que tienes un componente Skeleton

// Skeleton para una sola tarjeta de venta
const SaleCardSkeleton = () => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Skeleton para la imagen */}
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
              <Skeleton className="h-8 w-24" /> {/* Precio */}
            </div>
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Descripción y estado */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" /> 
            <Skeleton className="h-4 w-5/6" /> 
            <Skeleton className="h-4 w-32 mt-1" /> {/* Estado */}
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Detalles de la compra (Comprador y Fecha) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" /> {/* Comprador */}
              <Skeleton className="h-4 w-48" /> {/* Fecha de orden */}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton principal para la lista de ventas
const SaleInfoSkeleton = () => {
  // Muestra 3 esqueletos
  const skeletonItems = Array.from({ length: 3 }); 

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header (Title and Filter) Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-40" /> {/* Título */}
          <Skeleton className="h-10 w-32" /> {/* Select Filter */}
        </div>

        <div className="space-y-6">
          {skeletonItems.map((_, index) => (
            <SaleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleInfoSkeleton;