"use client";
import { Button } from "@/components/ui/button";
import { CartItem, useCartStore } from "@/store/cartStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

type CartCardProps = {
  item: CartItem;
};

const CartCard = ({item}: CartCardProps) => {    
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  return (
    <div className="px-2 py-6 shadow-md rounded-lg w-full">
      <div className="flex flex-row gap-4 bg-white rounded-lg overflow-hidden">
        {/* Imagen */}
        <div className="relative h-28 w-32 md:h-36 md:w-40 flex-shrink-0">
          <Image
            src={`${item.media[0].fileUrl}`}
            alt="lego"
            fill
            className="object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between flex-1 h-28 md:h-34">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2 max-w-md">{item.title}</h3>
            <p className="text-green-700 font-bold">{item.price}</p>
          </div>

          {/* Botones al fondo */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <Button
                className="bg-[#4c754b] hover:bg-[#558d54] text-white rounded-full size-8 flex items-center justify-center p-0"
                aria-label="Decrementar cantidad"
              >
                -
              </Button>
              <span>1</span>
              <Button
                className="bg-[#4c754b] hover:bg-[#558d54] text-white rounded-full size-8 flex items-center justify-center p-0"
                aria-label="Incrementar cantidad"
              >
                +
              </Button>
            </div>

            <Button variant="destructive" size="icon" className="h-8 w-8 p-0 bg-gray-400" onClick={() => removeFromCart(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
