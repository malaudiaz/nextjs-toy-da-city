// SellerBuyerReviewsSkeleton.tsx
import React from "react";

const SellerBuyerReviewsSkeleton = () => {
  // Simula 3 reseñas (puedes ajustar)
  const skeletonReviews = Array.from({ length: 3 });

  return (
    <div className="lg:min-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {skeletonReviews.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow border border-gray-100 animate-pulse"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Avatar + info */}
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-5 h-5 bg-gray-300 rounded" />
                    ))}
                  </div>
                </div>
              </div>
              {/* Fecha */}
              <div className="h-3 w-16 bg-gray-300 rounded self-end flex-shrink-0" />
            </div>

            {/* Comentario */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full" />
                <div className="h-3 bg-gray-300 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerBuyerReviewsSkeleton;