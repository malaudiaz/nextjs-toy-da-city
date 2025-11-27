"use client";
import { useTranslations } from "next-intl";
import React from "react";
import SellerInfo from "./SellerInfo";
import { SellerProfile, ReviewEligibility } from "@/types/modelTypes";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";

type Props = {
  seller: SellerProfile;
  reviewsEligible: ReviewEligibility;
};

const ReviewClient = ({ seller, reviewsEligible }: Props) => {
  const t = useTranslations("reviewForm");

  const handleReviewSubmitted = () => {
    toast.success(t("thank"));
  };
  return (
    <>
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

      {!reviewsEligible.canReview ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p>{t("eligible")}</p>
        </div>
      ) : (
 <div className="bg-white rounded-lg shadow p-6">
          <ReviewForm
            targetUserId={seller.id}
            orderId={reviewsEligible.orderId || undefined}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}
    </>
  );
};

export default ReviewClient;
