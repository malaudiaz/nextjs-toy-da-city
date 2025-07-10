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
      className="bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex w-full group cursor-pointer"
    >
      <div className="custom-w-1-3 md:w-1/4 h-48 md:h-auto relative bg-gray-200 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col flex-grow p-4 sm:p-5 justify-between">
        <div className="flex justify-between items-start mb-3">
          <span className="font-bold text-xl sm:text-2xl text-green-700">
            {price === 0 ? (
              <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm text-xs sm:text-sm">
                GRATIS
              </span>
            ) : (
              <>
                ${price.toFixed(2).split(".")[0]}
                <span className="text-sm align-super ml-px">
                  .{price.toFixed(2).split(".")[1] || "00"}
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

        <p className="text-gray-700 text-base mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1 text-gray-500 text-sm truncate mb-2">
            <MapPin className="size-4" /> Florida
          </div>

          <Button className="w-full sm:w-auto rounded-xl bg-[#e07a5f] hover:bg-[#bb664f]">
            Add to the Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchCard;