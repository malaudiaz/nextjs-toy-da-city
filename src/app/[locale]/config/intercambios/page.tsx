import Image from "next/image";
import {
  Calendar,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Datos de ejemplo para intercambios
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ExchangesPage() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exchanges.map((exchange) => (
            <Card
              key={exchange.id}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Intercambio con {exchange.partner}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Mi artículo
                    </p>
                    <Image
                      src={exchange.myItemImage || "/placeholder.svg"}
                      alt={exchange.myItem}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-[100px] h-[100px] mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">{exchange.myItem}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Su artículo
                    </p>
                    <Image
                      src={exchange.theirItemImage || "/placeholder.svg"}
                      alt={exchange.theirItem}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-[100px] h-[100px] mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">{exchange.theirItem}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Propuesta: {formatDate(exchange.proposalDate)}</span>
                  </div>

                  {exchange.completedDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        Completado: {formatDate(exchange.completedDate)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    Ver Detalles
                  </Button>
                  {exchange.status === "pending" && (
                    <Button size="sm" className="flex-1">
                      Responder
                    </Button>
                  )}
                  {exchange.status === "completed" && !exchange.rating && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      Calificar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
