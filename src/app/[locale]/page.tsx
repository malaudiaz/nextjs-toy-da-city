import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import Products from "@/components/shared/home/Products";
import SkeletonProductCard from "@/components/shared/SkeletonProductCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getToys } from "@/lib/actions/toysAction";
import { Suspense } from "react";

interface ToysProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: ToysProps) {
  const resolvedSearchParams = await searchParams;

  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) || "8"
  );
  const searchQuery = (resolvedSearchParams.search as string) || "";

  const { totalPosts } = await getToys(currentPage, postsPerPage);
  const toysPromise = getToys(currentPage, postsPerPage, searchQuery).then((data) => ({
    data: data.toys,
  }));

  return (
    <>
      <BannerCarousel />
      <Suspense key={searchQuery} fallback={<SkeletonProductCard count={8} />}>
        <Products toysPromise={toysPromise} />
      </Suspense>
      <div className="mt-8">
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPosts}
        />
      </div>
    </>
  );
}
