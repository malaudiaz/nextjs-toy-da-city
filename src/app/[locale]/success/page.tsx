'use client';
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const t = useTranslations("successPage");
  const locale = useLocale();

  useEffect(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get(
      'payment_intent'
    );

    console.log('Payment successful:', paymentIntent);

    const timer = setTimeout(() => {
      useCartStore.getState().clearCart();
      toast.info(t("cartCleared"));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <p className="text-lg text-gray-600">{t("confirmOrder")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-lg w-full text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {t("title")}
        </h1>

        <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
          {t("subtitle")}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          {t("queryTitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            {t("backHome")}
          </Link>
          <Link
            href={`/${locale}/config/purchases`}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
          >
            {t("viewOrders")}
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          {t("reviewSeller")}{" "}
          <Link
            href={`/${locale}/profile/reviews`}
            className="text-blue-600 hover:underline"
          >
            {t("review")}
          </Link>
        </p>
      </div>
    </div>
  );
}