import { Toy } from "@/types/toy";
import React from "react";
import ProductCard from "../ProductCard";

type ProductCardProps = {
  toys: Toy[];
};

const ProductList = ({ toys }: ProductCardProps) => {
  return (
    <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {toys?.map((toy) => (
          <ProductCard
            key={toy.id}
            description={toy.description}
            image={toy.media[0]?.fileUrl}
            price={toy.price}
            location={toy.location}
            conditionDescription={toy.conditionDescription}
            id={toy.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
