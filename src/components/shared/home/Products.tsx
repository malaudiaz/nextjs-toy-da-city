import { Toy } from "@/types/toy";
import React, { Suspense } from "react";
import ProductCard from "../ProductCard";
import SkeletonProductCard from "../SkeletonProductCard";

type ProductCardProps = {
  toys: {
    data: Toy[];
  };
};

const Products = ({ toys }: ProductCardProps) => {
  return (
    <div className="mx-auto max-w-7xl px-1 pb-6 md:px-16 lg:px-8 mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {toys?.data?.map((toy) => (
          <ProductCard
            key={toy.id}
            image={toy.media[0].fileUrl}
            description={toy.description}
            price={toy.price}
            location={toy.location}
            conditionId={toy.conditionId}
          />
        ))}    
        </div>  

    </div>
  );
};

export default Products;
