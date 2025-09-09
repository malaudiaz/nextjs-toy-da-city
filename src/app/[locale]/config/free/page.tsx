import RegalosInfo from "@/components/shared/profile/RegalosInfo";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

const gifts = [
  {
    id: 1,
    type: "sent",
    productName: "Teddy Bear Premium",
    price: 45.99,
    image: "/lego.png",
    sender: "Papá",
    recipient: "Mi sobrina Emma",
    occasion: "Cumpleaños",
    date: "2024-01-10",
    message: "¡Feliz cumpleaños princesa!",
    status: "delivered",
  },
  {
    id: 2,
    type: "received",
    productName: "LEGO Architecture Set",
    price: 79.99,
    image: "/lego.png",
    recipient: "Mi sobrina Emma",
    sender: "Papá",
    occasion: "Navidad",
    date: "2023-12-25",
    message: "Para mi arquitecto favorito",
    status: "received",
  },
  {
    id: 3,
    type: "sent",
    productName: "Puzzle 500 piezas",
    price: 19.99,
    image: "/lego.png",
    sender: "Papá",
    recipient: "Abuela Carmen",
    occasion: "Día de la Madre",
    date: "2024-01-14",
    message: "¡Feliz cumpleaños princesa!",
    status: "in_transit",
  },
]

const RegalosPage = () => {
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <RegalosInfo gifts={gifts} />
    </div>
  );
};

export default RegalosPage;
