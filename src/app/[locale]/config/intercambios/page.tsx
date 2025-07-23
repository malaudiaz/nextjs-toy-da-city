import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SwapInfo from "@/components/shared/profile/SwapInfo";

const exchanges = [
  {
    id: 1,
    myItem: "Pokémon Cards Collection (150 cartas)",
    theirItem: "Yu-Gi-Oh! Deck Completo + Extras",
    myItemImage: "/lego.png",
    theirItemImage: "/lego.png",
    partner: "Carlos Pokémon Master",
    status: "completed",
    proposalDate: "2024-01-08",
    completedDate: "2024-01-12",
    rating: 5,
    review: "Excelente intercambio, las cartas llegaron en perfecto estado",
    type: "received", // received proposal
  },
  {
    id: 2,
    myItem: "Hot Wheels Collection (50 coches)",
    theirItem: "Transformers Optimus Prime Masterpiece",
    myItemImage: "/lego.png",
    theirItemImage: "/lego.png",
    partner: "Ana Coleccionista",
    status: "pending",
    proposalDate: "2024-01-15",
    type: "sent", // sent proposal
    estimatedValue: { mine: 125.99, theirs: 89.99 },
  },
  {
    id: 3,
    myItem: "Barbie Dream House + Accesorios",
    theirItem: "LOL Surprise Mega Set + Casa",
    myItemImage: "/lego.png",
    theirItemImage: "/lego.png",
    partner: "María Juguetes Premium",
    status: "negotiating",
    proposalDate: "2024-01-13",
    type: "received",
    messages: 8,
    lastMessage: "2024-01-16",
  },
  {
    id: 4,
    myItem: "LEGO Creator Expert Big Ben",
    theirItem: "LEGO Technic Bugatti Chiron",
    myItemImage: "/lego.png",
    theirItemImage: "/lego.png",
    partner: "Pedro LEGO Fan",
    status: "rejected",
    proposalDate: "2024-01-10",
    rejectedDate: "2024-01-11",
    type: "sent",
    rejectionReason: "El estado del producto no coincide con la descripción",
  },
];



export default function ExchangesPage() {
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <SwapInfo exchanges={exchanges} />
    </div>
  );
}
