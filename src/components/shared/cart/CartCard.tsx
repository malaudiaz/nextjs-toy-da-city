"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/lib/actions/userActions";
import { CartItem, useCartStore } from "@/store/cartStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import useSWR from "swr";

type CartCardProps = {
  item: CartItem;
};

const CartCard = ({ item }: CartCardProps) => {
  const { data, error, isLoading } = useSWR("getUsers", getUsers);

  console.log(data);

  const removeFromCart = useCartStore((state) => state.removeFromCart);
  return (
    <div className="px-2 py-4 shadow-sm rounded-lg w-full border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-row gap-4 bg-white rounded-lg overflow-hidden">
        {/* Imagen (mantenida como en la versión original) */}
        <div className="relative h-32 w-32 md:h-36 md:w-40 flex-shrink-0">
          <Image
            src={`${item.media[0].fileUrl}`}
            alt={item.title}
            fill
            className="object-cover h-fit"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between flex-1 h-auto">
          <div className="flex flex-col gap-2">
            <h3 className="text-md md:text-lg font-semibold line-clamp-1 md:line-clamp-2 max-w-md">
              {item.title}
            </h3>
            <p className="text-green-700 font-bold">{item.price}</p>

            {/* Información del vendedor */}
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Vendedor</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : error ? (
                  <span className="text-xs text-red-500">Error al cargar</span>
                ) : (
                  data?.users.map(
                    (user) =>
                      item.sellerId === user.id && (
                        <p key={user.id} className="text-sm font-medium">
                          {user.name}
                        </p>
                      )
                  )
                )}
              </div>
              </div>
              <div className="flex justify-end items-center mt-auto px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar del carrito"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
