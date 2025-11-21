import FavoritesInfo from "@/components/shared/profile/FavoritesInfo";
import FavoritesInfoSkeleton from "@/components/shared/profile/FavoritesInfoSkeleton"; // 1. Importa el Skeleton
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getFavorites } from "@/lib/actions/toysAction";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

// 3. Componente async que realiza el fetching (la parte lenta)
// Este componente se suspenderá hasta que la promesa se resuelva.
const FavoritesContent = async ({ favoritesPromise }: { favoritesPromise: ReturnType<typeof getFavorites> }) => {
    // Espera a que la promesa de datos se resuelva
    const favorites = await favoritesPromise;
    
    return <FavoritesInfo favorites={favorites} />;
}

// 4. El Page Component se convierte en el contenedor de Suspense
const FavoritosPage = async () => {
  // La función getFavorites() devuelve una Promesa.
  const favoritesPromise = getFavorites(); 

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
                 <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
                 <Breadcrumbs className="md:hidden"/>
      </div>
      
      {/* 5. Envuelve el contenido que puede suspenderse en Suspense */}
      <Suspense fallback={<FavoritesInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <FavoritesContent favoritesPromise={favoritesPromise} />
      </Suspense>
    </div>
  );
};

export default FavoritosPage;