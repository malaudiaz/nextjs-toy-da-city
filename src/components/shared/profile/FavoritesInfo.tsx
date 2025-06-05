import React from "react";
import { ProfileInfoProps } from "./ProfileInfo";
import Image from "next/image";

const FavoritesInfo = ({ produts }: ProfileInfoProps) => {
  return (
    <div className="w-full h-full px-3 py-2 mt-4">
      <div className="bg-[#F0F5F0] gap-2 mt-2 rounded-md shadow-sm overflow-x-auto">
        <div className="grid grid-cols-4 gap-2 px-3 py-2 font-semibold text-gray-700 border-b border-gray-300 bg-gray-100">
          <div>Imagen</div>
          <div className="text-center">Nombre</div>
          <div className="text-center">Dueño</div>
          <div className="text-right">Precio</div>
        </div>

        {produts.map((product) => (
          <div
            key={product.data}
            className="grid grid-cols-4 gap-2 px-3 py-2 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-center w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={product.image}
                alt={product.name || "Producto"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Nombre  probar sin el truncate */}
            <div className="text-center truncate max-w-xs">{product.name}</div>

            <div className="text-center truncate max-w-xs">{product.owner}</div>

            <div className="text-right font-medium">{`${product.price} €`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesInfo;
