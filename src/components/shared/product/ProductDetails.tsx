"use client";

import { Toy } from "@/types/toy";
import React, { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NumberToCategory, NumberToCondition } from "@/lib/utils";
import Image from "next/image";
import ExpandableText from "../ExpandableText";

type ProductDetailsProps = {
  data: Toy;
};

const ProductDetails = ({ data }: ProductDetailsProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % data.media.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + data.media.length) % data.media.length
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{data.title}</h1>
      <div className="flex items-center justify-between mb-2">
        {/* <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < Math.floor(productData.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {productData.rating} ({productData.reviews} reviews)
            </span>
          </div> */}
        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {NumberToCategory(data.categoryId)}
        </span>
      </div>

      {/* Rating */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
            <div className="aspect-square relative">
              {/* eslint-disable @next/next/no-img-element */}

              <Image
                src={data.media[selectedImage].fileUrl}
                alt={data.title}
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
                {selectedImage + 1} / {data.media.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-6 gap-3">
            {data.media.map((image, index) => (
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
                  src={data.media[index].fileUrl}
                  alt={`${data.title} view ${index + 1}`}
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
                ${data.price.toFixed(2)}
              </span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>
            <div>
              <h2>{NumberToCondition(data.conditionId)}</h2>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">Orders over $25</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day policy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Safe & Secure</p>
                    <p className="text-sm text-gray-600">Child-tested</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <ExpandableText text={data.description} maxLength={200} />
          </div>
          <div className="">
            <div className="flex items-center">
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 w-full">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>
          </div>

          {/* Shipping Info */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
