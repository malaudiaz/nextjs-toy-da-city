// app/cart/page.tsx
import { useCartStore } from '@/store/cartStore';
import Breadcrumbs from '@/components/shared/BreadCrumbs';
import CartCard from '@/components/shared/cart/CartCard';
import { Card } from '@/components/ui/card';
import CartClient from './CartClient';
import { useTranslations } from "next-intl";
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const t = useTranslations("cart");

  // Si el carrito está vacío, mostrar mensaje centrado
  if (items.length === 0) {
    return (
      <div className="max-w-8xl px-4 py-6 md:mx-auto">
        <Breadcrumbs productName={t("title")} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Card className="p-12 max-w-md w-full">
            <div className="flex flex-col items-center gap-4">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-700">
                {t("emptyTitle")}
              </h2>
              <p className="text-gray-500">
                {t("emptyMessage")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl px-4 py-6 md:mx-auto">
      <Breadcrumbs productName={t("title")} />
      <div className="flex flex-row justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
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
            <h2 className="text-xl font-bold mb-6">{t("subtitle")}</h2>
            <div className="flex flex-row gap-2 justify-between text-lg font-bold mb-6">
              <span>Total </span>
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