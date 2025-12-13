import FreeInfo from "@/components/shared/profile/FreeInfo";
import FreeInfoSkeleton from "@/components/shared/profile/FreeInfoSkeleton"; // 1. Importa el Skeleton
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getFree } from "@/lib/actions/toysAction";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { Sale } from "@/types/modelTypes";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

type ProductsProps = {
  free: Sale[];
};
const FreeContent = async ({ free }: ProductsProps) => {
  return <FreeInfo free={free} />;
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const FreePage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const { free, totalPosts, totalPages } = await getFree(
    currentPage,
    postsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config" />
        <Breadcrumbs className="md:hidden" />
      </div>

      {/* 5. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<FreeInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <FreeContent free={free} />
      </Suspense>
      {totalPages > 1 && (
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPosts}
        />
      )}
    </div>
  );
};

export default FreePage;
