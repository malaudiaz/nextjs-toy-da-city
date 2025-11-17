import React, { Suspense } from "react"; // 1. Importa Suspense
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getRelatedToys, getToy } from "@/lib/actions/toysAction";
import ProductDetails from "@/components/shared/product/ProductDetails";
import FeaturesProduct from "@/components/shared/product/FeaturesProduct";
import { getUserById } from "@/lib/actions/getUserActions";
import { Metadata } from "next";
import ProductDetailsSkeleton from "@/components/shared/product/ProductDetailsSkeleton"; // 2. Importa el Skeleton

type ProductDataProps = {
  params: { id: string, locale: string }; // Ajustado a objeto simple para consistencia con Next.js props
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
}: { params: { id: string, locale: string } }): Promise<Metadata> {
  // Nota: generateMetadata no recibe un Promise en params, sino el objeto directo.
  const toyId = params.id;
  const locale = params.locale;
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
      toy.isActive ? "In Stock" : "Out of Stock"}.`,
    keywords: [toy.title.toLowerCase()],
  };
}

// 3. Nuevo componente async que realiza todo el fetching
async function ProductContent({ params }: ProductDataProps) {
    const toyId = params.id;
    const locale = params.locale;
    
    // Ejecutar todas las promesas
    const { toy } = await getToyData(toyId, locale);
    const featuredToys = await getRelatedToys(toyId);

    // Obtener datos del vendedor
    const seller = await getUserById(toy.sellerId);  
    
    return (
        <>
            <Breadcrumbs productName={toy.title} />
            <ProductDetails toy={toy} seller={seller}/>
            {featuredToys.toys.length > 0 && <FeaturesProduct products={featuredToys.toys} />}
        </>
    );
}

// 4. El Page Component envuelve el contenido lento con Suspense
async function ProductDetailsPage({ params }: ProductDataProps) {
  
  // Convertir params a objeto simple si era promesa (para consistencia)
  const resolvedParams = params instanceof Promise ? await params : params;

  return (
    <div className="min-h-screen bg-[#FAF1DE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Envuelve el contenido que hace el fetch en Suspense */}
        <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductContent params={resolvedParams} />
        </Suspense>
      </main>
    </div>
  );
}

export default ProductDetailsPage;