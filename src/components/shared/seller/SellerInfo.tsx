"use client";
import { SellerProfile } from "@/types/modelTypes";
import React from "react";
import { UserAvatar } from "../UserAvatar";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

type Props = {
  data: SellerProfile;
};

const SellerInfo = ({ data }: Props) => {
  const t = useTranslations("sellerProfile");
  return (
    <div className="flex items-center space-x-6">
      {data.imageUrl ? (
        <UserAvatar userId={data.id} src={data.imageUrl} alt={data.name} />
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
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800">
                {Number(data.averageRating).toFixed(1)} ({data.totalReviews}{" "}
                {t("review")}
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
  );
};

export default SellerInfo;
