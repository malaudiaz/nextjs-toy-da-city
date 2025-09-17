// app/profile/my-reviews/page.tsx
'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';
import fetcher from '@/lib/fetcher';
import { Toaster } from 'sonner';

// Tipado
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
  order: { id: string } | null;
}

interface MyReviewsData {
  name: string;
  reputation: number;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export default function MyReviewsPage() {
  const { user: clerkUser } = useUser();

  const {  data, error, isLoading, mutate } = useSWR<MyReviewsData>(
    '/api/profiles/my-reviews',
    fetcher,
    {
      refreshInterval: 30000, // Refresca cada 30 segundos
    }
  );

  // Escuchar evento global de nueva reseña (opcional)
  useEffect(() => {
    const handleNewReview = () => {
      mutate(); // Recargar si alguien deja una reseña
    };

    window.addEventListener('newReview', handleNewReview);
    return () => window.removeEventListener('newReview', handleNewReview);
  }, [mutate]);

  if (!clerkUser) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold">Debes estar logueado</h2>
        <p className="mt-2 text-gray-600">Inicia sesión para ver tus reseñas.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error al cargar</h2>
        <p className="mt-2 text-gray-600">Intenta recargar la página.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold">Sin datos</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Mi reputación como vendedor</h1>

      {/* Tarjeta de resumen */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{data.name}</h2>
            <p className="text-gray-600">Vendedor verificado</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 ${
                    star <= data.averageRating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-2xl font-bold mt-1">
              {data.averageRating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">
              Basado en {data.totalReviews} reseña{data.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Reseñas de compradores ({data.totalReviews})
        </h2>

        {data.reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              🌱 Aún no tienes reseñas. ¡Sigue vendiendo y brindando buen servicio!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.reviewer.name}</p>
                      {review.order && (
                        <p className="text-xs text-gray-500">
                          Por la orden #{review.order.id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    “{review.comment}”
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  {format(new Date(review.createdAt), 'dd MMMM yyyy, HH:mm')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón de recarga (opcional) */}
      <div className="mt-8 text-center">
        <button
          onClick={() => mutate()}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          Recargar reseñas
        </button>
      </div>
    </div>
  );
}