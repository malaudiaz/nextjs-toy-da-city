import React, { Suspense } from "react";
import PurchasesInfo from "@/components/shared/profile/PurchasesInfo";
import { getOrder, OrderStatus } from "@/lib/actions/orderActions";
import PurchasesInfoSkeleton from "@/components/shared/profile/PurchasesInfoSkeleton";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

// Tipos para los parámetros de la página
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Componente async que realiza el fetching
const PurchasesContent = async ({ searchParams }: Props) => {
  // Resolvemos la promesa de searchParams
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const filter = resolvedSearchParams.status
    ? { status: resolvedSearchParams.status as OrderStatus }
    : {};

  // Aquí se realiza la llamada a la base de datos
  const { purchases, totalPosts, totalPages } = await getOrder(
    currentPage,
    postsPerPage,
    filter.status
  );

  return (
    <>
    <PurchasesInfo orders={purchases} />;
  {
    totalPages > 1 && (
      <div className="pb-4">
        <PaginationWithLinks
        page={currentPage}
        pageSize={postsPerPage}
        totalCount={totalPosts}
      />
      </div>
    )
  }
    </>
  )
};

const PurchasePage = async ({ searchParams }: Props) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config" />
        <Breadcrumbs className="md:hidden" />
      </div>

      <Suspense fallback={<PurchasesInfoSkeleton />}>
        <PurchasesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PurchasePage;
