import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import SaleInfoSkeleton from "@/components/shared/profile/SaleInfoSkeleton"; // 1. Importa el Skeleton
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { getSales } from "@/lib/actions/toysAction";
import React, { Suspense } from "react"; // 2. Importa Suspense

type SalesStatus = "available" | "reserved" | "sold" | "canceled";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 3. Componente async que realiza el fetching (la parte lenta)
const SalesContent = async ({ searchParams }: Props) => {
  // Resolvemos la promesa de searchParams
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const filter = resolvedSearchParams.status
    ? { status: resolvedSearchParams.status as SalesStatus }
    : {};

  const { sales, totalPages, totalPosts } = await getSales(
    currentPage,
    postsPerPage,
    filter.status || "sold"
  );

  return (
    <>
      <SaleInfo sales={sales} />
      {totalPages > 1 && (
        <div className="pb-4">
          <PaginationWithLinks
            page={currentPage}
            pageSize={postsPerPage}
            totalCount={totalPosts}
          />
        </div>
      )}
    </>
  );
};

// 4. El Page Component se convierte en el contenedor de Suspense
const SalesPage = async ({ searchParams }: Props) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config" />
        <Breadcrumbs className="md:hidden" />
      </div>

      {/* 5. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<SaleInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <SalesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default SalesPage;
