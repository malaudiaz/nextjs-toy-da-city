import { Toy } from "@/types/toy";
import React, { Suspense } from "react";
import Await from "../Await";
import SkeletonProductCard from "../SkeletonProductCard";
import ProductList from "./ProductList";

interface ProductData {
  data: Toy[];
}

type ProductsProps = {
  toysPromise: Promise<ProductData>;
};

const Products = ({ toysPromise }: ProductsProps) => {
  return (
     <Suspense fallback={<SkeletonProductCard count={8} />}>
      <Await promise={toysPromise}>
        {(data) => <ProductList toys={data.data} />}
      </Await>
    </Suspense>
  );
};

export default Products;
