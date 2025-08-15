// app/components/StripeCheckoutButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
  const t = useTranslations("stripeCheckoutButton");

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        window.location.origin + "/es/api/checkout/create-session",
        {
          method: "POST",
          body: JSON.stringify({ cartItems }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.firstUrl) {
        // ✅ Redirige directamente a Checkout
        window.location.href = data.firstUrl;
      } else {
        toast.info(t('NoSession'));
      }
    } catch (err) {
      console.error(err);
      toast.info(t('Error'));
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || !isSignedIn}
      className="mt-6 w-full bg-[#4c754b] hover:bg-[#558d54]"
    >
      {isLoading ? t("Process") : t("Checkout")}
    </Button>
  );
}
