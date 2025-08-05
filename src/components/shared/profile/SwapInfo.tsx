import Image from "next/image";
import {
  Calendar,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ExchangeProps = {
    id: number;
    myItem: string;
    theirItem: string;
    myItemImage: string;
    theirItemImage: string;
    partner: string;
    status: string;
    proposalDate: string;
    completedDate?: string;
    rating?: number;
    review?: string;
    type: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SwapInfo = ({ exchanges }: { exchanges: ExchangeProps[] }) => {
  return (
   <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
         <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Swaps</h1>
        </div>
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
  )
}

export default SwapInfo
