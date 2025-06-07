import ProfileInfo from "@/components/shared/profile/ProfileInfo";
import React from "react";
import { products } from "../ventas/page";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

const ComprasPage = () => {
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">  
        <Breadcrumbs/>
        <h1 className="text-lg font-bold">Tus Compras</h1>
      </div>


        <ProfileInfo secondaryTitle="Tus Compras" produts={products} hideSecondaryTitle={true} />
    </div>
  );
};

export default ComprasPage;
