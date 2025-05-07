import React from "react";
import ProductCard from "../ProductCard";

const ProductHome = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center gap-x-4 py-6">
          <h3 className="text-xl font-bold whitespace-nowrap">
            Lo más vendido
          </h3>
          <div className="bg-black h-[1px] w-full"></div>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {
          Array.from({ length: 4 }, (_, index) => (
            <ProductCard key={index} />
          ))  
        }
      </div>
         
      </div>
    </div>
  );
};

export default ProductHome;
