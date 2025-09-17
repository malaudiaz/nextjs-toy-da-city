// components/shared/reviews/SellerInfo.tsx
'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface SellerInfoProps {
  name: string;
  createdAt: string;
  averageRating: number | null;
  totalReviews: number;
  clerkId: string;
}

export default function SellerInfo({
  name,
  createdAt,
  averageRating,
  totalReviews,
}: SellerInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <div className="flex items-center mt-2">
            {averageRating !== null ? (
              <>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= (averageRating ?? 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-700">
                  {Number(averageRating).toFixed(1)} ({totalReviews} reseñas)
                </span>
              </>
            ) : (
              <span className="text-gray-500">Sin valoraciones</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Miembro desde {format(new Date(createdAt), 'MMMM yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}