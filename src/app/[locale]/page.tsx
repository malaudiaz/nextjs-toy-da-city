import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import FilterBar from "@/components/shared/home/FilterBar";
import Products from "@/components/shared/home/Products";
import SkeletonProductCard from "@/components/shared/SkeletonProductCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getConditions } from "@/lib/actions/conditionActions";
import { Filters, getToys } from "@/lib/actions/toysAction";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>;
};

export default async function Home({ searchParams, params }: Props) {
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  const conditions = await getConditions();
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
    <>
      <BannerCarousel />
      <div className="w-full px-3">
        <FilterBar conditions={conditions} />
      </div>
      <Suspense
        key={filters.search}
        fallback={<SkeletonProductCard count={8} />}
      >
        <Products toysPromise={toysPromise} />
      </Suspense>
      <div className="mt-8 mb-4">
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPosts}
        />
      </div>
    </>
  );
}
