// app/seller/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { StarIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import fetcher from "@/lib/fetcher";
import ReviewForm from "@/components/shared/reviews/ReviewForm";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useLocale } from "next-intl"; // ✅ Importa useLocale

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

interface SellerProfile {
  id: string;
  name: string;
  imageUrl?: string;
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
  reviewsReceived: Review[];
}

export default function SellerProfilePage() {
  const t = useTranslations("sellerProfile");
  const locale = useLocale(); // ✅ Obtiene el locale actual (ej. 'es', 'en')

  // ✅ 1. Hooks iniciales (SIEMPRE al inicio, sin condiciones)
  const params = useParams<{ id: string }>();
  const { id: sellerId } = params;
  const { user: clerkUser } = useUser();

  const { data, error, isLoading, mutate } = useSWR<SellerProfile>(
    sellerId ? `/api/profiles/${sellerId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);

  // ✅ 2. useEffect también al inicio (nunca después de un return)
  useEffect(() => {
    if (!clerkUser || !sellerId) return;

    const checkEligibility = async () => {
      try {
        const res = await fetch(`/api/reviews/eligible?sellerId=${sellerId}`);
        const eligibility = await res.json();

        if (eligibility?.canReview) {
          setIsEligible(true);
          setEligibleOrderId(eligibility?.orderId);
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
      }
    };

    checkEligibility();
  }, [clerkUser, sellerId]);

  // ✅ 3. Manejadores (también pueden ir aquí o dentro del return, pero hooks primero)
  const handleReviewSubmitted = () => {
    mutate(); // Recarga los datos del vendedor
    setShowReviewForm(false);
    toast.success(t("gratitude"));
  };

  // ❌ 4. AHORA SÍ returns condicionales (después de todos los hooks)

  // Caso: usuario no logueado
  if (!clerkUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t("userNotLogged")}
        </h2>
        <p className="text-gray-600">{t("notLoggedMsg")}</p>
      </div>
    );
  }

  // Caso: cargando
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="space-y-3 flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Caso: error o perfil no encontrado
  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Vendedor no encontrado
        </h2>
        <p className="mt-2 text-gray-600">{t("profileNotFound")}</p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  // ✅ 5. Render final (solo llega aquí si todo está bien)
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Encabezado del vendedor */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center space-x-6">
            {data.imageUrl ? (
              <UserAvatar
                userId={data.id}
                src={data.imageUrl}
                alt={data.name}
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-white">
                  {data.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
              <div className="flex items-center mt-3">
                {data.averageRating !== null ? (
                  <>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-6 w-6 ${
                            star <= (data.averageRating ?? 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-3 text-xl font-semibold text-gray-800">
                      {Number(data.averageRating).toFixed(1)} (
                      {data.totalReviews} {t("review")}
                      {data.totalReviews !== 1 ? "s" : ""})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">{t("notRated")}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t("memberSince")} {format(new Date(data.createdAt), "MMMM yyyy")}
              </p>
              <p className="text-sm text-gray-700">
                Rol: <span className="font-medium capitalize">{data.role}</span>
              </p>
            </div>
          </div>

          {/* Botón de reseña (solo si es elegible) */}
          {isEligible && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {showReviewForm ? t("cancelMsg") : t("leaveReview")}
            </button>
          )}
        </div>

        {/* Formulario de reseña (condicional) */}
        {showReviewForm && isEligible && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {t("title")}
            </h3>
            <p className="text-gray-600 mb-4">{t("message")}</p>
            <ReviewForm
              targetUserId={sellerId}
              orderId={eligibleOrderId || undefined}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}
      </div>

      {/* Sección: Juguetes en venta */}
      {data.toysForSale.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-5 text-gray-900">
            {t("toysSeccionTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.toysForSale.map((toy) => (
              <Link
                key={toy.id}
                href={`/${locale}/toys/${toy.id}`}
                className="group bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-200"
              >
                <div className="aspect-square w-full mb-3 overflow-hidden rounded bg-gray-100">
                  {toy.primaryImageUrl ? (
                    <Image
                      src={toy.primaryImageUrl}
                      alt={toy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">{t("noImage")}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
                  {toy.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {toy.category.name}
                </p>
                <p className="font-bold text-lg text-blue-600">
                  €{toy.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sección: Reseñas de compradores */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("buyerReviews")} ({data.totalReviews})
          </h2>
          {data.totalReviews > 0 && (
            <span className="text-sm text-gray-500">
              {t("lastReviewFirst")}
            </span>
          )}
        </div>

        {data.reviewsReceived.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center border-2 border-dashed border-gray-300">
            <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("sellerWithoutReviews")}
            </h3>
            <p className="text-gray-500">{t("beTheFirst")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.reviewsReceived.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold text-gray-700">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.reviewer.name}
                      </p>
                      {review.order && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t("purchased")} {review.order.id}
                        </p>
                      )}
                      <div className="flex items-center mt-2">
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
                  </div>
                  <p className="text-xs text-gray-400 self-end flex-shrink-0">
                    {format(new Date(review.createdAt), "dd MMM yyyy")}
                  </p>
                </div>

                {review.comment && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      “{review.comment}”
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
