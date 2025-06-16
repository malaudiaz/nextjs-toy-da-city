import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col w-[180px] md:w-[200px] lg:w-[220px] xl:w-[250px]">
      {/* Imagen skeleton */}
      <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Contenido inferior */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <div className="flex justify-between items-center">
          {/* Precio */}
          <Skeleton className="h-6 w-1/4 rounded" />
          {/* Botón corazón */}
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        {/* Status badge */}
        <Skeleton className="h-5 w-16 rounded" />

        {/* Descripción */}
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />

        {/* Ubicación */}
        <Skeleton className="h-4 w-1/2 rounded mt-auto" />
      </div>
    </div>
  );
}