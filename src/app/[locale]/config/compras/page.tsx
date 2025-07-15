import React from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import PurchasesInfo from "@/components/shared/profile/PurchasesInfo";

const purchases = [
  {
    id: 1,
    productName: "PlayStation 5 Console",
    price: 499.99,
    image: "/lego.png",
    category: "Juguetes",
    seller: "TechStore Madrid",
    orderDate: "2024-01-10",
  },
  {
    id: 2,
    productName: "LEGO Millennium Falcon",
    price: 159.99,
    image: "/lego.png",
    category: "Juguetes",
    seller: "Juguetes Premium",
    orderDate: "2024-01-12",
  },
  {
    id: 3,
    productName: "Nintendo Switch Games Bundle",
    price: 89.99,
    image: "/lego.png",
    category: "Juguetes",
    seller: "GameWorld",
    orderDate: "2024-01-14",
  },
];

const ComprasPage = async () => {

  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <PurchasesInfo purchases={purchases} />
    </div>
  );
};

export default ComprasPage;
