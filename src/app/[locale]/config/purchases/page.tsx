import React, { Suspense } from "react";
import PurchasesInfo from "@/components/shared/profile/PurchasesInfo";
import { getOrder, OrderStatus } from "@/lib/actions/orderActions";
import PurchasesInfoSkeleton from "@/components/shared/profile/PurchasesInfoSkeleton"; 
import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

// Tipos para los parámetros de la página
interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams: Promise<{
    status?: OrderStatus;
  }>;
}

// Componente async que realiza el fetching
const PurchasesContent = async ({ searchParams }: { searchParams: Promise<{ status?: OrderStatus }> }) => {
  // Resolvemos la promesa de searchParams
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams || {};
  
  // Aquí se realiza la llamada a la base de datos
  const purchases = await getOrder(filter.status); // ✅ Tipado correcto
  
  return <PurchasesInfo orders={purchases} />;
}

// La Page Component debe ser async
const PurchasePage = async ({ searchParams }: PageProps) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
                <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
                <Breadcrumbs className="md:hidden"/>
      </div>
      
      <Suspense fallback={<PurchasesInfoSkeleton />}>
        <PurchasesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PurchasePage;

// Si necesitas generar metadata dinámicamente
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  return {
    title: `Purchase ${resolvedParams.id}`,
    // ... otras propiedades de metadata
  };
}