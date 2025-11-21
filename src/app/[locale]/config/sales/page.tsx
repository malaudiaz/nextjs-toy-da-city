import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import SaleInfoSkeleton from "@/components/shared/profile/SaleInfoSkeleton"; // 1. Importa el Skeleton
import { getSales } from "@/lib/actions/toysAction";
import React, { Suspense } from "react"; // 2. Importa Suspense

// 3. Componente async que realiza el fetching (la parte lenta)
const SalesContent = async ({ salesPromise }: { salesPromise: ReturnType<typeof getSales> }) => {
  // Espera a que la promesa de datos se resuelva
  const sales = await salesPromise;
  
  return <SaleInfo sales={sales} />;
}

// 4. El Page Component se convierte en el contenedor de Suspense
const SalesPage = async () => {
  // La función getSales() devuelve una Promesa.
  const salesPromise = getSales();
  
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
                <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
                <Breadcrumbs className="md:hidden"/>
      </div>
      
      {/* 5. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<SaleInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <SalesContent salesPromise={salesPromise} />
      </Suspense>
    </div>
  );
};

export default SalesPage;