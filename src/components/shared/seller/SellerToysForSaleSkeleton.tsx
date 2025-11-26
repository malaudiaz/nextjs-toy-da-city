// SellerToysForSaleSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SellerToysForSaleSkeleton = () => {
  // Simula 4 ítems (como en la grilla lg:grid-cols-4)
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="mb-10">
      <Skeleton className="h-8 w-48 rounded mb-5 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {skeletonItems.map((_, index) => (
          <Skeleton
            key={index}
            className="bg-white rounded-lg p-4 shadow border border-gray-100 animate-pulse"
          >
            {/* Imagen */}
            <Skeleton className="aspect-square w-full mb-3 rounded " />

            {/* Título */}
            <Skeleton className="h-4  rounded mb-1" />
            <Skeleton className="h-3 w-3/4  rounded mb-2" />

            {/* Categoría */}
            <Skeleton className="h-3 w-1/2  rounded mb-2" />

            {/* Precio */}
            <Skeleton className="h-5 w-16  rounded" />
          </Skeleton>
        ))}
      </div>
    </div>
  );
};

export default SellerToysForSaleSkeleton;