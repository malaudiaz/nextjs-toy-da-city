import React from "react";

import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getRelatedToys, getToy } from "@/lib/actions/toysAction";
import ProductDetails from "@/components/shared/product/ProductDetails";
import FeaturesProduct from "@/components/shared/product/FeaturesProduct";
import { getUserById } from "@/lib/actions/getUserActions";
import { Metadata } from "next";

type ProductDataProps = {
  params: Promise<{ id: string, locale: string }>;
};

async function getToyData(id: string, locale: string) {
  const toy = await getToy(id);
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}` || `https://toydacity.com/${locale}`;

  return {
    toy,
    baseUrl
  };
}

export async function generateMetadata({
  params,
}: ProductDataProps): Promise<Metadata> {
  const toyId = (await params).id;
  const locale  = (await params).locale;
  const {toy, baseUrl} = await getToyData(toyId, locale);

  if (!toy) {
    return {
      title: "Toy Not Found",
      description: "The requested toy could not be found.",
      alternates: {
        canonical: `${baseUrl}/toys/${toyId}`,
      },
    };
  }

  return {
    title: `${toy.title} | MetadataWebsite`,
    description: `${toy.description} Price: $${toy.price}. ${
      toy.isctive ? "In Stock" : "Out of Stock"}.`,
    keywords: [toy.title.toLowerCase()],
  };
}

async function ProductDetailsPage({ params }: ProductDataProps) {
  const toyId = (await params).id;
  const locale  = (await params).locale;
  const { toy } = await getToyData(toyId, locale);
  const featuredToys = await getRelatedToys(toyId);

  // Obtener datos del vendedor
  const seller = await getUserById(toy.sellerId);  

  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs productName={toy.title} />
        <ProductDetails toy={toy} seller={seller}/>
        {featuredToys.toys.length > 0 && <FeaturesProduct products={featuredToys.toys} />}
      </main>
    </div>
  );
}

export default ProductDetailsPage;
