'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTranslations } from "next-intl";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  media: { fileUrl: string }[];
  sellerId: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSuccess?: () => void;
}

export default function CheckoutForm({ cartItems, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("checkoutForm");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast.error(error.message || t("payError"));
    } else if (onSuccess) {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      
      <PaymentElement 
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
            spacedAccordionItems: false
          },
        }}
      />

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#4c754b] hover:bg-[#558d54]"
      >
        {loading ? t("processing") : `${t("pay")} $${cartItems.reduce((a, b) => a + b.price, 0).toFixed(2)}`}
      </Button>
    </form>
  );
}