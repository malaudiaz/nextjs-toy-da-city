// SellerToysForSaleSkeleton.tsx
import React from "react";

const SellerToysForSaleSkeleton = () => {
  // Simula 4 ítems (como en la grilla lg:grid-cols-4)
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="mb-10 lg:min-w-6xl mx-auto">
      <div className="h-8 w-48 bg-gray-300 rounded mb-5 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {skeletonItems.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow border border-gray-100 animate-pulse"
          >
            {/* Imagen */}
            <div className="aspect-square w-full mb-3 rounded bg-gray-300" />

            {/* Título */}
            <div className="h-4 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-3/4 bg-gray-300 rounded mb-2" />

            {/* Categoría */}
            <div className="h-3 w-1/2 bg-gray-300 rounded mb-2" />

            {/* Precio */}
            <div className="h-5 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerToysForSaleSkeleton;