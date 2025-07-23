"use client"
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import CartCard from "@/components/shared/cart/CartCard";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import React from "react";

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  return (
    <div className="max-w-8xl px-4 py-6 md:mx-auto">
      {/* Breadcrumb */}
      <Breadcrumbs />
      {/* Título y cantidad */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold">Cart</h1>
        <p className="self-end text-sm text-gray-500">Items: {items.length}</p>
      </div>

      {/* Lista de productos + resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tarjetas del carrito */}
        <div className="lg:col-span-3 space-y-4">
          {
            items.map((item, index) => (
              <CartCard key={index} item={item} />
            ))
          }
        </div>

        {/* Resumen del carrito - solo en desktop */}
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 h-fit hidden lg:block">
          <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{items.reduce((acc, item) => acc + item.price, 0)}</span>
            </div>
            <div className="border-t border-b py-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{(items.reduce((acc, item) => acc + item.price, 0) + (items.reduce((acc, item) => acc + item.price, 0)*0.1)).toFixed(2)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full bg-[#4c754b] hover:bg-[#558d54]">
            Proceder al pago
          </Button>
        </div>
      </div>

      {/* Botón de checkout para móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md border-t border-gray-200 z-10">
        <Button className="w-full rounded-2xl bg-[#4c754b] hover:bg-[#558d54]"
          aria-label="Proceder al pago"
        >
          Checkout - $180
        </Button>
      </div>
    </div>
  );
};

export default CartPage;