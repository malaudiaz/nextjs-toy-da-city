import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import ConditionBadge from "./ConditionBadge";
import { useTranslations } from "next-intl";

type ProductCardProps = {
  id:string
  description: string;
  image?: string;
  price: number;
  conditionDescription: string;
  location: string;
};

const ProductCard = ({
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
      className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col w-[180px] md:w-[200px] lg:w-[220px] xl:w-[250px]"
      aria-label={`Ver detalles de ${description}`}
    >
      {/* Imagen */}
      <div className="w-full h-48 relative bg-gray-200 overflow-hidden rounded-t-lg">
        <Image
          src={image || "/image 4.png"}
          alt={description}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 22vw, 15vw"
        />
      </div>

      {/* Contenido inferior */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-[calc(14px_+_0.5vw)] text-green-700">
            {price === 0 ? <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm">{t("free")}</span> : `$${price.toFixed(2).split(".")[0]}`}
            <span className="text-[0.7em] align-super ml-px">
              {price === 0 ? "" : price.toFixed(2).split(".")[1] || "00"}
            </span>
          </span>
          <button
            type="button"
            aria-label="Agregar a favoritos"
            className="bg-white p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-6 w-6 text-black" />
          </button>
        </div>

        <ConditionBadge condition={conditionDescription} />

        {/* Descripción truncada */}
        <p className="line-clamp-2 min-h-[3em] text-gray-600 mb-2 flex-grow">
          {description}
        </p>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 truncate">{location}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
