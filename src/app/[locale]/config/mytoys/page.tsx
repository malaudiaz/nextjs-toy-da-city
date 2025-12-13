import ToyGrid from "@/components/config/ToyGrid";
import ToyGridSkeleton from "@/components/config/ToyGridSkeleton"; // 1. Importa el Skeleton
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getOwnToys } from "@/lib/actions/toysAction";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { Toy } from "@/types/modelTypes";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ToysPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const { toys, totalPosts, totalPages } = await getOwnToys(currentPage, postsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
        <Breadcrumbs className="md:hidden"/>
        
        {/* 3. Envuelve ToyGrid con Suspense */}
        <Suspense fallback={<ToyGridSkeleton />}>
          <ToysContent toys={toys} />
        </Suspense>
        { totalPages > 1 && (
          <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPosts}
        />
        )}
      </div>
    </div>
  );
};

export default ToysPage;

type ProductsProps = {
  toys: Toy[];
}

const ToysContent = async ({toys}: ProductsProps) => {

    return <ToyGrid toys={toys} />;
}