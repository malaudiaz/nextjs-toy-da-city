import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SwapInfo from "@/components/shared/profile/SwapInfo";
import SwapInfoSkeleton from "@/components/shared/profile/SwapInfoSkeleton"; // 1. Importa el Skeleton
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getSwaps } from "@/lib/actions/toysAction";
import { Sale } from "@/types/modelTypes";
import React, { Suspense } from "react"; // 2. Importa Suspense

type ProductsProps = {
  swaps: Sale[];
};

const SwapContent = async ({ swaps }: ProductsProps) => {
  return <SwapInfo swaps={swaps} />;
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ExchangesPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const { swaps, totalPosts, totalPages } = await getSwaps(
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
      <Suspense fallback={<SwapInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <SwapContent swaps={swaps} />
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
}
