"use client";

import { Toy } from "@/types/toy";
import React, { useState } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { NumberToCategory } from "@/lib/utils";
import Image from "next/image";
import ExpandableText from "../ExpandableText";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/cartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
//import { CommentDialog } from "./CommentDialog";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@clerk/nextjs";
import Profile from "../Profile";
import { ChatButton } from "../ChatButton";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import WhatsAppContact from "../WhatsAppContact";

// Importación dinámica con exportación por defecto correcta
const MapComponent = dynamic(
  () => import("../MapComponent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">
        Cargando mapa...
      </div>
    ),
  }
);

type ProductDetailsProps = {
  toy: Toy;
  seller: {
    id: string; // ID de Prisma (id de la tabla 'users')
    fullName: string;
    imageUrl: string;
    clerkId: string;
    email: string;
    phone: string;
    role: string; // Incluir el rol para la validación/información
    reputation: number;
    reviewsCount: number; // Cantidad total de reseñas recibidas
  } | null;
};

//const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const ProductDetails = ({ toy, seller }: ProductDetailsProps) => {
  const { user } = useUser();
  const isCurrentUser = user?.id === seller?.id;

  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(toy.isFavorite);
  const { isSignedIn } = useAuth();

  //const { data, error } = useSWR("getFavoriteById", getFavoriteById);
  const t = useTranslations("cartStore");
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % toy.media.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + toy.media.length) % toy.media.length
    );
  };

  const { addToFavorites } = useFavorite();

  const handleFavorite = async () => {
    try {
      const res = await addToFavorites(toy.id);

      if (res.data) {
        toast.success(
          !favorite ? "Added to favorites" : "Removed from favorites"
        );
        setFavorite(!favorite);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to favorites");
      setFavorite(false);
    }
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const coordinates = toy.location ? toy.location.split(",").map(Number) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{toy.title}</h1>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {NumberToCategory(toy.categoryId, t)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
            <div className="aspect-square relative">
              {/* eslint-disable @next/next/no-img-element */}

              <Image
                src={toy.media[selectedImage].fileUrl}
                alt={toy.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {toy.media.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-6 gap-3">
            {toy.media.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  selectedImage === index
                    ? "border-green-500 shadow-lg"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <img
                  src={toy.media[index].fileUrl}
                  alt={`${toy.title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-green-700">
                ${toy.forSell ? toy.price.toFixed(2) : t("free")}
              </span>

              {isSignedIn && !isCurrentUser && toy.isActive && (
                <button
                  disabled={!isSignedIn}
                  onClick={handleFavorite}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    favorite && isSignedIn
                      ? "text-red-500 bg-red-50 hover:bg-red-100"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${favorite ? "fill-current" : ""}`}
                  />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 space-x-2 justify-between">
              <h2 className="inline-block text-sm font-medium px-2 py-1 rounded-lg">
                <span>{t("condition")}:</span> <span className="text-green-600 font-bold">{toy.conditionDescription}</span>
              </h2>
              <h2 className="inline-block text-sm font-medium px-2 py-1 rounded-lg">
                <span>{t("status")}:</span> <span className={toy.isActive ? "text-green-600 font-bold" : "text-red-700 font-bold"}>{toy.statusDescription}</span>
              </h2>

            </div>
          </div>

          {/* Features */}
          {toy.description && (
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <ExpandableText text={toy.description} maxLength={200} />
            </div>
          )}

          {coordinates.length === 2 && (
            <div className="h-[200px] w-full border-dashed border-2 border-gray-300 rounded-md overflow-hidden relative z-0">
              <MapComponent
                onLocationChange={() => {}}
                initialPosition={[coordinates[0], coordinates[1]]}
                dragable={false}
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              {toy.forSell && toy.isActive && isSignedIn && !isCurrentUser && (
                <button
                  onClick={() => {
                    const added = addToCart({
                      id: toy.id,
                      title: toy.title,
                      price: toy.price,
                      media: toy.media,
                      sellerId: toy.sellerId,
                    });
                    if (added) {
                      toast.success(t("itemAdded")); // ✅ Traducido: "Item added to cart"
                    } else {
                      toast.error(t("itemExist")); // ✅ Traducido: "Item already in cart"
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 w-full"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{t("addToCart")}</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Link href={`/seller/${toy.sellerId}`}>
                  <Profile user={seller} />
                </Link>
                <div className="flex items-center gap-2">
                  {isSignedIn && !isCurrentUser && toy.isActive && (
                    <ChatButton toy={toy} seller={seller} />
                  )}

                  {seller?.phone && isSignedIn && !isCurrentUser && toy.isActive && (
                    <WhatsAppContact
                      phoneNumber={seller.phone}
                      size="small"
                      iconOnly={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
