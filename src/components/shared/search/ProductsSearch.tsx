import { Toy } from "@/types/toy";
import React, { Suspense } from "react";
import Await from "../Await";
import ProductRow from "./ProductRow";
import SkeletonProductSearch from "./SkeletonProductSearch";

interface ProductData {
  data: Toy[];
}

type ProductsProps = {
  toysPromise: Promise<ProductData>;
};

const ProductsSearch = ({ toysPromise }: ProductsProps) => {
   return (
     <Suspense fallback={<SkeletonProductSearch count={8} />}>
      <Await promise={toysPromise}>
        {(data) => <ProductRow toys={data.data} />}
      </Await>
    </Suspense>
  );
};

export default ProductsSearch;