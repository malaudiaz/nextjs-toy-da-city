"use client";

import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useEffect } from "react"; // ✅ Importa useEffect

// --- Tipos ---
interface CartItem {
  id: string;
  title: string;
  price: number;
  media: { fileUrl: string }[];
  sellerId: string;
}

interface PaymentIntentRequest {
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    userId: string;
  }[];
  buyerId: string;
}

interface PaymentIntentResponse {
  clientSecret?: string;
  error?: string;
}

// --- Fetcher tipado ---
const fetcher = ([url, body]: [string, PaymentIntentRequest]): Promise<PaymentIntentResponse> => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => res.json() as Promise<PaymentIntentResponse>);
};

// --- Componente ---

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}) {
  const { isSignedIn, user } = useUser();
  const locale = useLocale();
  const lang = (!locale ? "en" : locale) as "es" | "en";
  const t = useTranslations("checkoutModal");

  // ✅ Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const shouldFetch =
    isOpen && isSignedIn && user && cartItems.length > 0;

  const {
    data,
    error,
    isLoading,
  } = useSWR(
    shouldFetch
      ? [
          "/api/create-payment-intent",
          {
            cartItems: cartItems.map((item) => ({
              id: item.id,
              name: item.title,
              price: item.price,
              quantity: 1,
              userId: item.sellerId,
            })),
            buyerId: user.id,
          } satisfies PaymentIntentRequest,
        ]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: () => {
        toast.error(t("payError"));
        onClose();
      },
    }
  );

  if (!isOpen) return null;

  if (error || (data && data.error)) {
    setTimeout(onClose, 0);
    return null;
  }

  const clientSecret = data?.clientSecret;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ✅ Fondo semitransparente con blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* ✅ Contenido del modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("endPurchase")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light"
          >
            ×
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          ) : !isSignedIn ? (
            <div className="text-center py-4">
              <p className="text-gray-600">{t("login")}</p>
            </div>
          ) : clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                locale: lang, 
                appearance: {
                  theme: 'stripe',
                },
              }}            
            >
              <CheckoutForm cartItems={cartItems} onSuccess={onClose} />
            </Elements>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">{t("lodingPayError")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}