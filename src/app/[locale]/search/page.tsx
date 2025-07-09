import FilterSidebar from "@/components/shared/search/FilterSidebar";
import ProductsSearch from "@/components/shared/search/ProductsSearch";
import SkeletonProductSearch from "@/components/shared/search/SkeletonProductSearch";
import { Filters, getToys } from "@/lib/actions/toysAction";
import React, { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>;
};

const SearchPage = async ({ searchParams, params }: Props) => {
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
  return (
    <div className="w-full flex bg-[#FAF1DE] min-h-screen ">
      <FilterSidebar />
      <Suspense
        key={filters.search}
        fallback={<SkeletonProductSearch count={3} />}
      >
        <ProductsSearch toysPromise={toysPromise} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
