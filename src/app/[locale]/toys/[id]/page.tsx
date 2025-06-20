"use client"
import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import Breadcrumbs from '@/components/shared/BreadCrumbs';

// Mock product data
const productData = {
  id: 1,
  name: "Educational Building Blocks Set",
  price: 29.99,
  rating: 4.8,
  reviews: 124,
  description: "Premium wooden building blocks designed to spark creativity and develop fine motor skills. Made from sustainable materials with smooth, child-safe finishes.",
  features: [
    "100 colorful wooden pieces",
    "Ages 3-8 years",
    "Non-toxic, eco-friendly materials",
    "Develops spatial reasoning",
    "Includes storage bag"
  ],
  images: [
    "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1148999/pexels-photo-1148999.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1148999/pexels-photo-1148999.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1148999/pexels-photo-1148999.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  inStock: true,
  category: "Educational Toys",
  brand: "ToyMakers",
  sku: "TM-BB-001"
};

function App() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={productData.images[selectedImage]}
                  alt={productData.name}
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
                  {selectedImage + 1} / {productData.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === index 
                      ? 'border-green-500 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} view ${index + 1}`}
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {productData.category}
                </span>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavorite 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{productData.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productData.rating} ({productData.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-green-700">${productData.price}</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <p>{productData.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Quantity:</span>

                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                </div>
                 <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 md:w-full">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               
              </div>
            </div>

            {/* Shipping Info */}
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
        </div>

       
      </main>
    </div>
  );
}

export default App;