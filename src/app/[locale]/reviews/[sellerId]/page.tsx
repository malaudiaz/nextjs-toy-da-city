// app/reviews/[sellerId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import fetcher from "@/lib/fetcher";
import ReviewForm from "@/components/shared/reviews/ReviewForm";
import SellerInfo from "@/components/shared/reviews/SellerInfo";
import { toast } from "sonner";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import Breadcrumbs from "@/components/shared/BreadCrumbs";

// Tipos
interface UserProfile {
  id: string;
  name: string;
  imageUrl?: string;
  clerkId: string;
  createdAt: string;
  averageRating: number | null;
  totalReviews: number;
}

interface ReviewEligibility {
  canReview: boolean;
  orderId: string | null;
  message?: string;
}

export default function ReviewPage() {
  const t = useTranslations("reviewPage"); // ✅ Usa el hook
  const params = useParams<{ sellerId: string }>();
  const { sellerId } = params;
  const { user: clerkUser } = useUser();
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);

  // Obtener info del vendedor
  const {
    data: seller,
    mutate,
    error: sellerError,
    isLoading: sellerLoading,
  } = useSWR<UserProfile>(
    sellerId ? `/api/profiles/${sellerId}` : null,
    fetcher
  );
  // Verificar elegibilidad
  useEffect(() => {
    if (!clerkUser || !sellerId) return;

    const checkEligibility = async () => {
      try {
        const res = await fetch(`/api/reviews/eligible?sellerId=${sellerId}`);
        const data: ReviewEligibility = await res.json();

        if (data.canReview) {
          setIsEligible(true);
          setEligibleOrderId(data.orderId);
        } else {
          toast.error(data.message || t("cantReview"));
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
        toast.error("Error al verificar elegibilidad.");
      }
    };

    checkEligibility();
  }, [clerkUser, sellerId, t]);

  const handleReviewSubmitted = () => {
    // Recargar perfil del vendedor
    mutate();
    toast.success(t("thank"));
    // Opcional: redirigir
    // router.push(`/profile/${sellerId}`);
  };

  if (sellerLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (sellerError || !seller) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">{t("notFound")}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">

      <div className="py-3">
        <Breadcrumbs productName={seller.name} ignoreSegment="reviews"/>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {t("review")} {seller.name}
      </h1>

      {/* Info del vendedor */}
      <SellerInfo
        id={seller.id}
        name={seller.name}
        imageUrl={seller.imageUrl}
        createdAt={seller.createdAt}
        averageRating={seller.averageRating}
        totalReviews={seller.totalReviews}
        clerkId={seller.clerkId}
      />

      {/* Formulario o mensaje */}
      {!clerkUser ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p>{t("loginMsg")}</p>
        </div>
      ) : !isEligible ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p>{t("eligible")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <ReviewForm
            targetUserId={sellerId}
            orderId={eligibleOrderId || undefined}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}
    </div>
  );
}
