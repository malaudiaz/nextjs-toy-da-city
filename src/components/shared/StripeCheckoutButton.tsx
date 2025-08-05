// app/components/StripeCheckoutButton.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

interface StripeCheckoutButtonProps {
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

export default function StripeCheckoutButton({
  cartItems,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useUser();

  const handleCheckout = async () => {
    console.log(cartItems);

    console.log({ id: "prod_test", name: "Test", price: 10.99, quantity: 1 })

    setIsLoading(true);

    try {
      // 2. Crear la solicitud al endpoint
      const response = await fetch(window.location.origin + "/es/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems: [
              { id: "prod_test", name: "Test", price: 10.99, quantity: 1 },
            ],
          }),
          //body: JSON.stringify({ cartItems }),
        }
      );

      // 3. Manejar errores HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (!stripe) throw new Error("Stripe no pudo cargarse");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error en el pago:", error);
        alert("Ocurrió un error durante el pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al procesar tu pedido");
    } finally {
      setIsLoading(false);
    }
  };

/*   const testCheckout = async () => {
    const res = await fetch(window.location.origin + "/es/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: [
          { id: "prod_test", name: "Test", price: 10.99, quantity: 1 },
        ],
      }),
    });

    // 3. Manejar errores HTTP
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const { sessionId } = await res.json();

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    if (!stripe) throw new Error("Stripe no pudo cargarse");

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Error en el pago:", error);
      alert("Ocurrió un error durante el pago");
    }
  };
 */

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isLoading || !isSignedIn}
      className="mt-6 w-full bg-[#4c754b] hover:bg-[#558d54]"
    >
      {isLoading ? "Procesando..." : "Pagar con Stripe"}
    </Button>      
  );
}
