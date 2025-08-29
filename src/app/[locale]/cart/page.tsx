// app/cart/page.tsx

'use client'

import { useCartStore } from '@/store/cartStore';
import Breadcrumbs from '@/components/shared/BreadCrumbs';
import CartCard from '@/components/shared/cart/CartCard';
import { Card } from '@/components/ui/card';
import CartClient from './CartClient';

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="max-w-8xl px-4 py-6 md:mx-auto">
      <Breadcrumbs />
      <div className="flex flex-row justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold">Carrito</h1>
        <p className="text-sm text-gray-500">Items: {items.length}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {items.map((item, index) => (
            <CartCard key={index} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Resumen</h2>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</span>
            </div>

            {/* ✅ Aquí se renderiza el Client Component */}
            <CartClient items={items} />
          </Card>
        </div>
      </div>
    </div>
  );
}