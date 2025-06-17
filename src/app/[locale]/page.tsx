import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import Products from "@/components/shared/home/Products";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getToys } from "@/lib/actions/toysAction";

interface ToysProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: ToysProps) {
 const resolvedSearchParams = await searchParams;

  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt((resolvedSearchParams.pageSize as string) || "8");

  const { toys, totalPosts } = await getToys(currentPage, postsPerPage);

  return (
    <>
      <BannerCarousel />
      <Products toys={toys} />
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
