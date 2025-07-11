import ProfileInfo from "@/components/shared/profile/ProfileInfo";
import React from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { getTranslations } from "next-intl/server";

const products = [
  {
    image: "/image 4.png",
    price: 200,
    data: "Sale from 2023-01-01",
    name: "Car",
    owner: "Miguel",
  },
  {
    image: "/image 4.png",
    price: 250,
    data: "Sale from 2023-02-01",
    name: "Buzz Lightyear",
    owner: "Rodolfo",
  },
];

const ComprasPage = async () => {

  const t = await getTranslations("purchases")

  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] md:hidden">  
        <Breadcrumbs/>
        <h1 className="text-lg font-bold">{t("Title")}</h1>
      </div>


        <ProfileInfo secondaryTitle="Your Purchases" produts={products} hideSecondaryTitle={true} />
    </div>
  );
};

export default ComprasPage;
