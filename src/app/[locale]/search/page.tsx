import FilterBar from "@/components/shared/home/FilterBar"; // Tu FilterBar mejorado
import ProductsSearch from "@/components/shared/search/ProductsSearch";
//import SkeletonProductSearch from "@/components/shared/search/SkeletonProductSearch";
import SkeletonProductCard from "@/components/shared/SkeletonProductCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
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

  const { totalPosts } = await getToys(
    currentPage,
    postsPerPage,
    locale,
    filters
  );

  const toysPromise = getToys(currentPage, postsPerPage, locale, filters).then(
    (data) => ({
      data: data.toys,
    })
  );

  return (
    <main>
      {/* FilterBar ahora es responsive */}
      <FilterBar conditions={conditions} />

      {/* Contenido principal */}
      <div className="flex-1 mb-6">
        <Suspense
          key={filters.search}
          fallback={<SkeletonProductCard count={postsPerPage} />}
        >
          <ProductsSearch toysPromise={toysPromise} />
        </Suspense>
      </div>
      {totalPosts > postsPerPage && (
        <nav className="mb-6" aria-label="Paginación">
          <PaginationWithLinks
            page={currentPage}
            pageSize={postsPerPage}
            totalCount={totalPosts}
          />
        </nav>
      )}
    </main>
  );
};

export default SearchPage;
