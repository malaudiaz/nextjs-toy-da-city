// src/components/shared/product/ProductDetailsSkeleton.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Separator } from "@/components/ui/separator";

const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-4">
            <Skeleton className="h-4 w-64 mb-6" />
        </div>
        
        {/* Título Principal Skeleton */}
        <Skeleton className="h-10 w-3/4 mb-3" />
        <Skeleton className="h-4 w-32 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna de Imagen (Izquierda) */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <Skeleton className="aspect-square w-full rounded-2xl shadow-lg" />
            
            {/* Thumbnail Gallery Skeleton */}
            <div className="grid grid-cols-6 gap-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Columna de Información (Derecha) */}
          <div className="space-y-6">
            {/* Precio y Botón de Favorito */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-32" /> {/* Precio */}
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Corazón */}
            </div>

            {/* Condición */}
            <Skeleton className="h-6 w-32" />

            {/* Descripción/Features Box */}
            <div className="bg-gray-200 rounded-xl p-6 border border-gray-300">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12 mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>

            {/* Mapa Skeleton */}
            <Skeleton className="h-[200px] w-full rounded-md" />

            {/* Botón Añadir al Carrito */}
            <Skeleton className="h-14 w-full rounded-xl" />

            {/* Vendedor y Botones de Contacto */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                    <Skeleton className="h-4 w-40" /> {/* Nombre del vendedor */}
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" /> {/* Botón Chat */}
                    <Skeleton className="h-10 w-10 rounded-full" /> {/* Botón WhatsApp */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Productos Relacionados Skeleton (FeaturesProduct) */}
        <Separator className="mt-12 mb-8" />
        <Skeleton className="h-8 w-60 mb-8" /> {/* Título "Productos Relacionados" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
                <Skeleton key={`feat-skel-${index}`} className="h-64 w-full rounded-lg" />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsSkeleton;