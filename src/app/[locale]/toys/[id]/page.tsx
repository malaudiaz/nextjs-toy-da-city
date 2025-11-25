import React, { Suspense } from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getRelatedToys, getToy } from "@/lib/actions/toysAction";
import ProductDetails from "@/components/shared/product/ProductDetails";
import FeaturesProduct from "@/components/shared/product/FeaturesProduct";
import { getUserById } from "@/lib/actions/getUserActions";
import ProductDetailsSkeleton from "@/components/shared/product/ProductDetailsSkeleton";


// Componente interno - CORREGIDO: ahora recibe props simples, no Promises
async function ProductContent({ id }: { id: string; locale: string }) {
  const toy = await getToy(id);
  const featuredToys = await getRelatedToys(id);
  const seller = await getUserById(toy.sellerId);  
 
  return (
    <>
      <Breadcrumbs productName={toy.title} />
      <ProductDetails toy={toy} seller={seller}/>
      {featuredToys.toys.length > 0 && <FeaturesProduct products={featuredToys.toys} />}
    </>
  );
}

// Componente de página principal
export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  // Resolvemos los params aquí y los pasamos como props simples
  const { id, locale } = await params;

  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductContent id={id} locale={locale} />
        </Suspense>
      </main>
    </div>
  );
}