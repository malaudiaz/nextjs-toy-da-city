"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function OrderConfirmedPage() {
  const [loading, setLoading] = useState(true);
  const t = useTranslations("ordersConfirmed");

  useEffect(() => {
    // Simulamos una carga inicial (opcional)
    const timer = setTimeout(() => {
      // Limpiar el carrito (ejemplo con localStorage)
      useCartStore.getState().clearCart();

      
      // Opcional: Actualizar el estado si usas un manejador de estado como Redux o Zustand
      // Ejemplo: dispatch(clearCart());
      toast.info(t("cartCleared")); // "Cart cleared after purchase"

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <p className="text-lg text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Icono de éxito */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
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

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {t("title")}
      </h1>

      <p className="text-lg text-gray-600 mb-2">
        {t("subtitle")}
      </p>
      <p className="text-sm text-gray-500">
        {t("queryTitle")}
      </p>

      <div className="flex gap-4 mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("backHome")}
        </Link>
        <Link
          href="/orders"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          {t("viewOrders")}
        </Link>
      </div>

      <p className="mt-12 text-sm text-gray-400">
        {t("questions")}{" "}
        <a
          href="mailto:soporte@tumarketplace.com"
          className="text-blue-600 hover:underline"
        >
          {t("contact")}
        </a>
      </p>
    </div>
  );
}
