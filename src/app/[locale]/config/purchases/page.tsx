import React, { Suspense } from "react";
import PurchasesInfo from "@/components/shared/profile/PurchasesInfo";
import { getOrder } from "@/lib/actions/orderActions";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
// Asume que este componente existe
import PurchasesInfoSkeleton from "@/components/shared/profile/PurchasesInfoSkeleton"; 

export type OrderStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELED"
  | "TRANSFERRED"
  | "REEMBURSED";

// Nota: Asumiendo que searchParams es el objeto estándar de Next.js.
type Props = {
  searchParams: { status?: OrderStatus } | Promise<{ status?: OrderStatus }>;
};


// 1. Componente async que realiza el fetching (la parte lenta)
// Este componente se "suspenderá" hasta que la promesa se resuelva.
const PurchasesContent = async ({ searchParams }: Props) => {
    // Si searchParams es una Promesa (como lo definiste originalmente), la resolvemos.
    const filter = searchParams instanceof Promise ? await searchParams : searchParams;
    
    // Aquí se realiza la llamada a la base de datos que suspenderá el renderizado.
    const purchases = await getOrder(filter.status);
    
    return <PurchasesInfo orders={purchases} />;
}

// 2. El Page Component (Server Component) ahora solo contiene la estructura
// y envuelve el contenido lento con Suspense.
const PurchasePage = ({ searchParams }: Props) => {
  // Ya no se llama a getOrder() ni se declara purchasesPromise aquí.

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <TitleBreakcrumbs translationScope="purchases" />
      </div>
      
      {/* 3. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<PurchasesInfoSkeleton />}>
        {/* Pasamos searchParams directamente a PurchasesContent */}
        <PurchasesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PurchasePage;