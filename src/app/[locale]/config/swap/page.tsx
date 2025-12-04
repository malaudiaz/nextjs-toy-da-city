import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SwapInfo from "@/components/shared/profile/SwapInfo";
import SwapInfoSkeleton from "@/components/shared/profile/SwapInfoSkeleton"; // 1. Importa el Skeleton
import { getSwaps } from "@/lib/actions/toysAction";
import React, { Suspense } from "react"; // 2. Importa Suspense

// 3. Componente async que realiza el fetching (la parte lenta)
const SwapContent = async ({
  swapsPromise,
}: {
  swapsPromise: ReturnType<typeof getSwaps>;
}) => {
  // Espera a que la promesa de datos se resuelva
  const swaps = await swapsPromise;

  return <SwapInfo swaps={swaps} />;
};

// 4. El Page Component (ExchangesPage) se convierte en el contenedor de Suspense
export default async function ExchangesPage() {
  // La función getSwaps() devuelve una Promesa.
  const swapsPromise = getSwaps();

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config" />
        <Breadcrumbs className="md:hidden" />
      </div>

      {/* 5. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<SwapInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <SwapContent swapsPromise={swapsPromise} />
      </Suspense>
    </div>
  );
}
