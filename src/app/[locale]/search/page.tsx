import FilterSidebar from "@/components/shared/search/FilterSidebar";
import ProductsSearch from "@/components/shared/search/ProductsSearch";
import SkeletonProductSearch from "@/components/shared/search/SkeletonProductSearch";
import { getConditions } from "@/lib/actions/conditionActions";
import { Filters, getToys } from "@/lib/actions/toysAction";
import React, { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>;
};


const SearchPage = async ({ searchParams, params }: Props) => {
  const conditions = await getConditions();
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "8"
  );

  const filters: Filters = {
    search: (resolvedSearchParams.search as string) || "",
    minPrice: resolvedSearchParams.minPrice
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined,
    locationRadius:
      resolvedSearchParams.lat &&
      resolvedSearchParams.lng &&
      resolvedSearchParams.radius
        ? {
            lat: Number(resolvedSearchParams.lat),
            lng: Number(resolvedSearchParams.lng),
            radius: Number(resolvedSearchParams.radius),
          }
        : undefined,
  };
  const toysPromise = getToys(currentPage, postsPerPage, locale, filters).then(
    (data) => ({
      data: data.toys,
    })
  );

  // SEO metaetiquetas
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toydacity.com";
  const canonicalUrl = `${baseUrl}/${locale}/search`;
  const title = locale === "es"
    ? "Buscar juguetes - Toydacity"
    : "Search toys - Toydacity";
  const description = locale === "es"
    ? "Encuentra juguetes nuevos, usados, para donar o intercambiar en Toydacity."
    : "Find new, used, donation or swap toys at Toydacity.";
  const image = `${baseUrl}/public/Logo.png`;

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* Hreflang para SEO multilingüe */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/search`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/search`} />
      </head>
      <div className="w-full flex bg-[#FBFAF4] min-h-screen ">
        <FilterSidebar conditions={conditions} />
        <Suspense
          key={filters.search}
          fallback={<SkeletonProductSearch count={3} />}
        >
          <ProductsSearch toysPromise={toysPromise} />
        </Suspense>
      </div>
    </>
  );
};

export default SearchPage;
