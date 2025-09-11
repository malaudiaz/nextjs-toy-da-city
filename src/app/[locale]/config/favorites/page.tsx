import FavoritesInfo from "@/components/shared/profile/FavoritesInfo";
import React from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getFavorites } from "@/lib/actions/toysAction";


const FavoritosPage = async () => {
   const favorites = await getFavorites()
    return (
      <div>
        <div className="px-5 py-3 md:hidden ">
          <Breadcrumbs />
        </div>
        <FavoritesInfo favorites={favorites}  />
      </div>
    );
};

export default FavoritosPage;
