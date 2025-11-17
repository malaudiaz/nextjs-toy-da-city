// src/components/shared/profile/PurchasesInfoSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
// Asume que tienes un componente Skeleton (e.g., de shadcn/ui)
import { Skeleton } from "@/components/ui/skeleton"; 

// Skeleton para una sola tarjeta de compra
const PurchaseCardSkeleton = () => (
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
              <Skeleton className="h-4 w-32" /> {/* Estado de la orden */}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-8 w-24" /> {/* Precio */}
            </div>
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Detalles (Vendedor y Fecha) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" /> {/* Vendedor */}
              <Skeleton className="h-4 w-48" /> {/* Fecha de orden */}
            </div>
          </div>

          <div className="my-4">
            <Skeleton className="h-px w-full" /> {/* Separator */}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton principal para la lista
const PurchasesInfoSkeleton = () => {
  // Muestra 3 esqueletos para simular la carga inicial
  const skeletonItems = Array.from({ length: 3 }); 

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton (Title and Filter) */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-40" /> {/* Título */}
          <Skeleton className="h-10 w-32" /> {/* Select Filter */}
        </div>

        <div className="space-y-6">
          {skeletonItems.map((_, index) => (
            <PurchaseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchasesInfoSkeleton;