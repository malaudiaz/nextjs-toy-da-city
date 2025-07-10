import { Toy } from "@/types/toy";
import React from "react";
import ProductSearchCard from "./ProductSearchCard";

type ProductCardProps = {
  toys: Toy[];
};

const ProductRow = ({ toys }: ProductCardProps) => {
  return (
    <div className="pr-5 pl-2 w-full mt-8">
      <div className="grid grid-cols-1 gap-2">
        {toys?.map((toy) => (
          <ProductSearchCard
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

export default ProductRow;