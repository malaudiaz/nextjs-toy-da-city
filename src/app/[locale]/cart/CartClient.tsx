// app/cart/CartClient.tsx
'use client';

import { useState } from 'react';
import CheckoutModal from '@/components/shared/CheckoutModal';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  media: {
    fileUrl: string;
  }[];
  sellerId: string;
}

export default function CartClient({ items }: { items: CartItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={items.length === 0}
        className="w-full bg-[#4c754b] hover:bg-[#558d54] text-white py-3 rounded disabled:opacity-50"
      >
        Comprar
      </button>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={onClose}
        cartItems={items}
      />
    </>
  );
}