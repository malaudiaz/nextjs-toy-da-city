import ProfileInfo from "@/components/shared/profile/ProfileInfo";
import React from "react";
import { products } from "../ventas/page";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getTranslations } from "next-intl/server";

const ComprasPage = async () => {

  const t = await getTranslations("purchases")

  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">  
        <Breadcrumbs/>
        <h1 className="text-lg font-bold">{t("Title")}</h1>
      </div>


        <ProfileInfo secondaryTitle="Your Purchases" produts={products} hideSecondaryTitle={true} />
    </div>
  );
};

export default ComprasPage;
