import FavoritesInfo from "@/components/shared/profile/FavoritesInfo";
import React from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

const favorites = [
  {
    id: 1,
    productName: "LEGO Creator Expert Taj Mahal",
    price: 369.99,
    originalPrice: 399.99,
    image: "/lego.png",
    seller: "LEGO Official Store",
    availability: "in_stock",
    addedDate: "2024-01-05",
    priceAlert: true,
    discount: 8,
  },
  {
    id: 2,
    productName: "Funko Pop! Batman Collection",
    price: 89.99,
    image: "/lego.png",
    seller: "Pop Culture Store",
    availability: "low_stock",
    addedDate: "2024-01-08",
    priceAlert: false,
    lastStock: 3,
  },
  {
    id: 3,
    productName: "Monopoly Edición Limitada",
    price: 0,
    image: "/lego.png",
    seller: "Board Games Plus",
    availability: "out_of_stock",
    addedDate: "2024-01-12",
    priceAlert: true,
  },
]

const FavoritosPage = () => {
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
     <FavoritesInfo favorites={favorites} />
    </div>
  );
};

export default FavoritosPage;
