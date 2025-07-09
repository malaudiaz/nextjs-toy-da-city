import { Skeleton } from "@/components/ui/skeleton";
import React from "react";


interface SkeletonProps {
  count?: number;
}

export default function SkeletonProductSearch({ count = 6 }: SkeletonProps) {
  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 gap-2">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-70 flex w-full group cursor-pointer animate-pulse">
      {/* Imagen */}
      <div className="w-1/5 h-full bg-gray-200 relative flex-shrink-0">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        {/* Precio y corazón */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <div className="text-sm align-super ml-px">
              <Skeleton className="h-4 w-6 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Badge de condición */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Descripción */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Ubicación y botón */}
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
          ))}
      </div>
    </div>
  );
}
