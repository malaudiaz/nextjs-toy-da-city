"use client";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useLocale } from "next-intl"; // ✅
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Toaster } from "sonner";

// Tipado
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    clerkId: string;
    imageUrl?: string;
  };
  order: { id: string } | null;
}

interface MyReviewsData {
  id: string;
  clerkId: string;
  name: string;
  imageUrl?: string;
  reputation: number;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

const ViewReputation = () => {
  const locale = useLocale(); // ✅ Siempre actualizado
  const t = useTranslations("reputation"); // ✅ Usa el hook

  const { data, error, isLoading, mutate } = useSWR<MyReviewsData>(
    `/${locale}/api/profiles/my-reviews`,
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

    window.addEventListener("newReview", handleNewReview);
    return () => window.removeEventListener("newReview", handleNewReview);
  }, [mutate]);

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
        <h2 className="text-2xl font-bold text-red-600">{t("reviewError")}</h2>
        <p className="mt-2 text-gray-600">{t("reviewMsg")}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold">{t("emptyMsg")}</h2>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Toaster />
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        {/* Tarjeta de resumen */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {data.imageUrl ? (
                <UserAvatar
                  userId={data.id}
                  src={data.imageUrl}
                  alt={data.name}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  <span className="font-bold text-gray-700">
                    {data.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <p className="text-gray-600 mt-1">{t("verify")}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-6 w-6 ${
                      star <= data.averageRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold mt-1">
                {data.averageRating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">
                {t("reviewBased")} {data.totalReviews} {t("reviewtotal")}
                {data.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de reseñas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {t("reviewTitle")} ({data.totalReviews})
          </h2>

          {data.reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">{t("emptyMsg")}</p>
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
                      {review.reviewer.imageUrl ? (
                        <UserAvatar
                          userId={review.reviewer.id}
                          src={review.reviewer.imageUrl}
                          alt={review.reviewer.name}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-700">
                            {review.reviewer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{review.reviewer.name}</p>
                        {review.order && (
                          <p className="text-xs text-gray-500">
                            {t("reviewOrder")} #{review.order.id}
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
                              ? "text-yellow-400"
                              : "text-gray-300"
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
                    {format(new Date(review.createdAt), "dd MMMM yyyy, HH:mm")}
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
            {t("reloadReview")}
          </button>
        </div>
      </div>
  );
};

export default ViewReputation;
