"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  media: { fileUrl: string }[];
  sellerId: string;
}

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && isSignedIn && user && cartItems.length > 0) {
      const createPaymentIntent = async () => {
        try {
          const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            body: JSON.stringify({
              cartItems: cartItems.map((item) => ({
                id: item.id,
                name: item.title,
                price: item.price,
                quantity: 1,
                userId: item.sellerId,
              })),
              buyerId: user.id,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            toast.error(data.error || "Error al iniciar pago");
            onClose();
          }
        } catch (err) {
          console.log("Error al crear PaymentIntent:", err);
          toast.error("Error de conexión");
          onClose();
        } finally {
          setLoading(false);
        }
      };

      setClientSecret(null);
      setLoading(true);
      createPaymentIntent();
    }
  }, [isOpen, isSignedIn, user, cartItems, onClose]);

  if (!isOpen) return null;

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

        {loading ? (
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
