"use client";

import { SellerProfile } from "@/types/modelTypes";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { UserAvatar } from "../UserAvatar";
import { format } from "date-fns";

type Props = {
  data: SellerProfile;
};

const SellerBuyerReviews = ({ data }: Props) => {
  const t = useTranslations("sellerProfile");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("buyerReviews")} ({data.totalReviews})
        </h2>
        {data.totalReviews > 0 && (
          <span className="text-sm text-gray-500">{t("lastReviewFirst")}</span>
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
                    {review.reviewer.imageUrl ? (
                      <UserAvatar
                        userId={review.reviewer.id}
                        src={review.reviewer.imageUrl}
                        alt={review.reviewer.name}
                      />
                    ) : (
                      <span className="font-bold text-gray-700">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    )}
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
                              ? "text-yellow-400 fill-yellow-400"
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
  );
};

export default SellerBuyerReviews;
