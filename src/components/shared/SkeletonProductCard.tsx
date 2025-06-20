import React from "react";
import { Skeleton } from "../ui/skeleton";

interface SkeletonProps {
  count?: number;
}

export default function SkeletonProductCard({ count = 6 }: SkeletonProps) {
  return (
    <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col w-[180px] md:w-[200px] lg:w-[220px] xl:w-[250px] animate-pulse"
            >
              {/* Imagen */}
              <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Contenido inferior */}
              <div className="flex flex-col flex-grow p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/4 rounded" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>

                <Skeleton className="h-5 w-16 rounded" />

                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />

                <Skeleton className="h-4 w-1/2 rounded mt-auto" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
