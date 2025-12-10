import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import SaleInfoSkeleton from "@/components/shared/profile/SaleInfoSkeleton"; // 1. Importa el Skeleton
import { getSales } from "@/lib/actions/toysAction";
import React, { Suspense } from "react"; // 2. Importa Suspense

type SalesStatus = "available" | "reserved" | "sold" | "canceled";

// Tipos para los parámetros de la página
interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams: Promise<{
    status?: SalesStatus;
  }>;
}

// 3. Componente async que realiza el fetching (la parte lenta)
const SalesContent = async ({
    searchParams
}: {
  searchParams: Promise<{ status?: SalesStatus }>;
}) => {

  // Resolvemos la promesa de searchParams
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams || {};

  // Aquí se realiza la llamada a la base de datos
  const sales = await getSales(filter.status || "sold"); // ✅ Tipado correcto

  return <SaleInfo sales={sales} />;
};

// 4. El Page Component se convierte en el contenedor de Suspense
const SalesPage = async ({ searchParams }: PageProps) => {
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
