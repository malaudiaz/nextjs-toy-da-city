import React from "react";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ConditionBadge from "../ConditionBadge";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  id: string;
  description: string;
  image: string;
  price: number;
  conditionDescription: string;
  location: string;
};

const ProductSearchCard = ({
  id,
  description,
  image,
  price,
  location,
  conditionDescription,
}: ProductCardProps) => {
  const t = useTranslations("toys");

  return (
    <Link
      href={`/toys/${id}`}
      className="bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-70 flex w-full group cursor-pointer"
      aria-label={`Ver detalles de ${description}`}
    >
      {/* Imagen a la izquierda */}
      <div className="w-1/5 h-full relative bg-gray-200 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={description}
          className="transition-transform duration-300 group-hover:scale-110"
          fill
        />
      </div>

      <div className="flex flex-col flex-grow p-5 justify-between">
        {/* Precio y corazón */}
        <div className="flex justify-between items-start mb-3">
          <span className="font-bold text-3xl text-green-700">
            {price === 0 ? (
              <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm text-sm">
                GRATIS
              </span>
            ) : (
              <>
                ${price.toFixed(2).split(".")[0]}
                <span className="text-sm align-super ml-px">
                  {price === 0 ? "" : price.toFixed(2).split(".")[1] || "00"}
                </span>
              </>
            )}
          </span>
          <button
            type="button"
            aria-label="Agregar a favoritos"
            className="bg-white p-2 rounded-full hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
          >
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>

        <ConditionBadge condition={conditionDescription} />

        {/* Descripción con más espacio */}
        <p className="text-gray-700 text-lg leading-relaxed mb-3 flex-grow line-clamp-2">
          {description}
        </p>

        {/* Ubicación */}
        <div className="flex flex-col gap-1">
          <p className="flex text-md text-gray-500 truncate font-medium items-center">
            <MapPin className="size-4" /> Florida
          </p>
          <Button className="mt-auto w-1/8 rounded-xl bg-[#e07a5f] hover:bg-[#bb664f]">
            Add to the Car
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchCard;
