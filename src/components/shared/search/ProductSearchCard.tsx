import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import ConditionBadge from "../ConditionBadge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useFavorite } from "@/hooks/useFavorite";

type ProductCardProps = {
  id: string;
  description: string;
  image: string;
  price: number;
  sellerId: string;
  isFavorite: boolean;
  conditionDescription: string;
  location: string;
};

// Fetcher para useSWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductSearchCard = ({
  id,
  description,
  image,
  price,
  sellerId,
  isFavorite,
  conditionDescription,
  location,
}: ProductCardProps) => {
  const t = useTranslations("ProductSearchCard");
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isCurrentUser = user?.id === sellerId;
  const [favorite, setFavorite] = useState(isFavorite);

  const { addToFavorites } = useFavorite();

  // Parsear coordenadas y usar useSWR para obtener la ciudad
  const getCoordinates = () => {
    if (!location) return null;
    try {
      const [longitude, latitude] = JSON.parse(location);
      return { latitude, longitude };
    } catch (error) {
      console.error("Error parsing location:", error);
      return null;
    }
  };

  const coordinates = getCoordinates();
  
  // useSWR para obtener la ciudad
  const { data: cityData, isLoading: loadingCity } = useSWR(
    coordinates 
      ? `/api/geocode?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const city = cityData?.city || t("locationNotFound");

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const res = await addToFavorites(id);

      if (res.data) {
        toast.success(
          !favorite ? t("addToFavorites") : t("removeFromFavorites")
        );
        setFavorite(!favorite);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("failedAddToFavorites"));
      setFavorite(false);
    }
  };

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
                {t("free")}
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

          {isSignedIn && !isCurrentUser && (
            <button
              disabled={!isSignedIn}
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-all duration-200 ${
                favorite && isSignedIn
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-6 h-6 ${favorite ? "fill-current" : ""}`} />
            </button>
          )}
        </div>

        <ConditionBadge condition={conditionDescription} />

        <p className="text-gray-700 text-base mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Mostrar la ciudad aquí - ANTES del botón Add to Cart */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            {loadingCity ? (
              <span className="text-gray-400">{t("loadingLocation")}</span>
            ) : (
              <span className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-1 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                {city}
              </span>
            )}
          </div>
          
          <Button className="rounded-xl bg-[#e07a5f] hover:bg-[#bb664f]">
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchCard;