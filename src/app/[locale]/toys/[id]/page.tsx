import React, { useState } from "react";

import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getToy } from "@/lib/actions/toysAction";
import ProductDetails from "@/components/shared/product/ProductDetails";

type ProductDataProps = {
  params: {
    id: string;
  }
}

async function ProductDetailsPage({ params }: ProductDataProps) {

  const toyId = (await params).id;  
  const toy = await getToy(toyId);

  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <ProductDetails data={toy} />
      </main>
    </div>
  );
}

export default ProductDetailsPage;

