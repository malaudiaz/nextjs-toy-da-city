import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import React from "react";

const salesInProgress = [
  {
    id: 1,
    productName: "LEGO Creator Expert Big Ben",
    price: 249.99,
    image: "/lego.png",
    description: "Jugador de videojuegos",
  },
  {
    id: 2,
    productName: "LEGO Creator Expert Big Ben",
    price: 249.99,
    image: "/lego.png",
    description: "Jugador de videojuegos",
  },
  {
    id: 3,
    productName: "LEGO Creator Expert Big Ben",
    price: 249.99,
    image: "/lego.png",
    description: "Jugador de videojuegos",
  },
];

const completedSales = [
  {
    id: 4,
    productName: "Nintendo Switch OLED",
    price: 349.99,
    image: "/lego.png",
    buyer: "Luis Fernández",
    saleDate: "2024-01-10",
  },
  {
    id: 5,
    productName: "Monopoly Edición Especial",
    price: 45.99,
    image: "/lego.png",
    buyer: "Luis Fernández",
    saleDate: "2024-01-10",
  },
  {
    id: 6,
    productName: "Puzzle 1000 piezas Disney",
    price: 24.99,
    image: "/lego.png",
    buyer: "Luis Fernández",
    saleDate: "2024-01-10",
  },
  {
    id: 7,
    productName: "Peluche Pokémon Pikachu",
    price: 19.99,
    image: "/lego.png",
    buyer: "Luis Fernández",
    saleDate: "2024-01-10",
  },
];

const VentasPage = async () => {
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <SaleInfo
        salesInProgress={salesInProgress}
        completedSales={completedSales}
      />
    </div>
  );
};

export default VentasPage;
