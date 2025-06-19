import Breadcrumbs from "@/components/shared/BreadCrumbs";
import ProfileInfo from "@/components/shared/profile/ProfileInfo";
import React from "react";

export const products = [
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

const VentasPage = () => {
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">
         <Breadcrumbs/>
        <h1 className="text-lg font-bold">Your Sales</h1>
      </div>

      <ProfileInfo
        title="In progress"
        secondaryTitle="Made"
        produts={products}
      />
    </div>
  );
};

export default VentasPage;
