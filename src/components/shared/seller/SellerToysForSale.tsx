"use client";
import { ToysForSale } from "@/types/modelTypes";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  data: ToysForSale[];
};

const SellerToysForSale = ({ data }: Props) => {
  const t = useTranslations("sellerProfile");
  const locale = useLocale();

  return (
    <div>
      {data.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-5 text-gray-900">
            {t("toysSeccionTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.map((toy) => (
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
                  <span className="font-bold text-[calc(14px_+_0.5vw)] text-green-700">
                    {toy.price === 0 ? (
                      <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm">
                        {t("free")}
                      </span>
                    ) : (
                      `$${toy.price.toFixed(2).split(".")[0]}`
                    )}
                    <span className="text-[0.7em] align-super ml-px">
                      {toy.price === 0
                        ? ""
                        : toy.price.toFixed(2).split(".")[1] || "00"}
                    </span>
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerToysForSale;
