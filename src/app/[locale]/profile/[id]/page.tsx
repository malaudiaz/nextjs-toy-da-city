// app/profile/[id]/page.tsx
import { notFound } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import Image from "next/image";

// Tipado para el perfil (opcional pero recomendado)
interface UserProfile {
  id: string;
  name: string;
  clerkId: string;
  role: string;
  reputation: number | null;
  createdAt: string;
  averageRating: number | null;
  totalReviews: number;
  toysForSale: {
    id: string;
    title: string;
    price: number;
    category: { name: string };
    primaryImageUrl: string | null;
  }[];
  reviewsReceived: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: {
      id: string;
      name: string;
    };
    order: { id: string } | null;
  }[];
}

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch al perfil desde la API Route
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/en/api/profiles/${id}`, {
    next: { revalidate: 60 }, // ISR: revalida cada 60 segundos
  });

  if (!res.ok) {
    notFound();
  }

  const user: UserProfile = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header del perfil */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex items-center mt-2">
              {user.averageRating !== null ? (
                <>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${
                            star <= (user.averageRating ?? 0) // ✅ ¡Ahora es seguro!
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700">
                    {user.averageRating} ({user.totalReviews} reseñas)
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Sin valoraciones</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Miembro desde {format(new Date(user.createdAt), 'MMMM yyyy')}
            </p>
            <p className="text-sm">
              Rol: <span className="font-medium capitalize">{user.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Juguetes en venta */}
      {user.toysForSale.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Juguetes en venta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.toysForSale.map((toy) => (
              <div
                key={toy.id}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {toy.primaryImageUrl ? (
                  <Image
                    src={toy.primaryImageUrl}
                    alt={toy.title}
                    className="w-full h-32 object-cover rounded"
                    width={300}
                    height={300}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <span>Sin imagen</span>
                  </div>
                )}
                <h3 className="font-medium mt-2">{toy.title}</h3>
                <p className="text-sm text-gray-600">{toy.category.name}</p>
                <p className="font-bold text-lg">€{toy.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reseñas */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reseñas ({user.totalReviews})</h2>
        {user.reviewsReceived.length === 0 ? (
          <p className="text-gray-500">Este usuario aún no tiene reseñas.</p>
        ) : (
          <div className="space-y-4">
            {user.reviewsReceived.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.reviewer.name}</p>
                      {review.order && (
                        <p className="text-xs text-gray-500">
                          Por orden #{review.order.id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {format(new Date(review.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}