import FreeInfo from "@/components/shared/profile/FreeInfo";
import FreeInfoSkeleton from "@/components/shared/profile/FreeInfoSkeleton"; // 1. Importa el Skeleton
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getFree } from "@/lib/actions/toysAction";

// 3. Componente async que realiza el fetching
const FreeContent = async ({ freePromise }: { freePromise: ReturnType<typeof getFree> }) => {
    // Espera a que la promesa de datos se resuelva
    const free = await freePromise;
    
    return <FreeInfo free={free} />;
}

// 4. El Page Component se convierte en el contenedor de Suspense
const FreePage = async() => {
    // La función getFree() devuelve una Promesa.
    const freePromise = getFree(); 
    
    // Ya no hacemos `await getFree()` aquí.

    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-background">
        <div className="px-5 py-3">
          <TitleBreakcrumbs translationScope="gifts" />
        </div>
        
        {/* 5. Envuelve el contenido lento con Suspense */}
        <Suspense fallback={<FreeInfoSkeleton />}>
          {/* Pasamos la Promesa al componente Content */}
          <FreeContent freePromise={freePromise} />
        </Suspense>
      </div>
    );
};

export default FreePage