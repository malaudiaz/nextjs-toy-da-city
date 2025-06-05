import ProfileInfo from "@/components/shared/profile/ProfileInfo";
import React from "react";

export const products = [
  {
    image: "/image 4.png",
    price: 200,
    data: "Venta de 2023-01-01",
    name: "Car",
    owner: "Miguel",
  },
  {
    image: "/image 4.png",
    price: 250,
    data: "Venta de 2023-02-01",
    name: "Buzz Lightyear",
    owner: "Rodolfo",
  },
];

const VentasPage = () => {
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-bold">Tus Ventas</h1>
      </div>

      <ProfileInfo
        title="En curso"
        secondaryTitle="Realizadas"
        produts={products}
      />
    </div>
  );
};

export default VentasPage;
