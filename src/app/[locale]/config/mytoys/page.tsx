import ToyGrid from "@/components/config/ToyGrid";
import ToyGridSkeleton from "@/components/config/ToyGridSkeleton"; // 1. Importa el Skeleton
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getOwnToys } from "@/lib/actions/toysAction";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import Breadcrumbs from "@/components/shared/BreadCrumbs";


const ToysPage = async () => {
  // getOwnToys() es la promesa que "suspende" la renderización.
  const toysPromise = getOwnToys(); 

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
        <Breadcrumbs className="md:hidden"/>
        
        {/* 3. Envuelve ToyGrid con Suspense */}
        <Suspense fallback={<ToyGridSkeleton />}>
          <ToysContent toysPromise={toysPromise} />
        </Suspense>

      </div>
    </div>
  );
};

export default ToysPage;


// 4. Crea un componente Wrapper para resolver la promesa
// Este componente se suspenderá hasta que la promesa se resuelva.
const ToysContent = async ({ toysPromise }: { toysPromise: ReturnType<typeof getOwnToys> }) => {
    const toys = await toysPromise;

    return <ToyGrid toys={toys} />;
}