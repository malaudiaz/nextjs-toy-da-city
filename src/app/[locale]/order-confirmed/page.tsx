"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl"; // ✅ Importa useLocale

export default function OrderConfirmedPage() {
  const [loading, setLoading] = useState(true);
  const t = useTranslations("ordersConfirmed");
  const locale = useLocale(); // ✅ Obtiene el locale actual (ej. 'es', 'en')

  useEffect(() => {
    const timer = setTimeout(() => {
      useCartStore.getState().clearCart();
      toast.info(t("cartCleared"));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md text-center">
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Tarjeta centrada */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Icono de éxito */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          {t("title")}
        </h1>

        <p className="text-gray-600 mb-2">{t("subtitle")}</p>
        <p className="text-sm text-gray-500 mb-6">{t("queryTitle")}</p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            {t("backHome")}
          </Link>
          <Link
            href={`/${locale}/config/purchases`}
            className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            {t("viewOrders")}
          </Link>
        </div>
      </div>
    </div>
  );
}