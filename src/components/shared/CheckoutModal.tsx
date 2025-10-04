"use client";

import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

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
        toast.error("Error al iniciar el pago");
        onClose();
      },
    }
  );

  if (!isOpen) return null;

  if (error || (data && data.error)) {
    // Cierra el modal si hay error (evita bucle con setTimeout si es necesario)
    setTimeout(onClose, 0);
    return null;
  }

  const clientSecret = data?.clientSecret;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Finalizar compra
        </h3>

        {isLoading ? (
          <p>Cargando...</p>
        ) : !isSignedIn ? (
          <p>Debes iniciar sesión.</p>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm cartItems={cartItems} onSuccess={onClose} />
          </Elements>
        ) : (
          <p>Error al cargar el pago.</p>
        )}
      </div>
    </div>
  );
}