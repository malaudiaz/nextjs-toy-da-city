import React from "react";

import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getRelatedToys, getToy } from "@/lib/actions/toysAction";
import ProductDetails from "@/components/shared/product/ProductDetails";
import FeaturesProduct from "@/components/shared/product/FeaturesProduct";
//import {  currentUser } from "@clerk/nextjs/server";

type ProductDataProps = {
  params: Promise<{ id: string }>;
}

async function ProductDetailsPage({ params }: ProductDataProps) {
const toyId = (await params).id;  
const toy = await getToy(toyId);
const featuredToys = await getRelatedToys(toyId);

  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs productName={toy.title}/>
        <ProductDetails toy={toy} />
        {featuredToys.toys && <FeaturesProduct products={featuredToys.toys} />}
      </main>
    </div>
  );
}

export default ProductDetailsPage;

