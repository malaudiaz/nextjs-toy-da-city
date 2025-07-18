import Image from "next/image";
import {
  Calendar,
  Package,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PurchaseProps = {
    id: number;
    productName: string;
    price: number;
    category: string;
    image: string;
    seller: string;
    orderDate: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}


const PurchasesInfo = ({ purchases }: { purchases: PurchaseProps[] }) => {
  return (
 <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mis Compras</h1>
        </div>

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {purchases.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron compras con los filtros seleccionados</p>
              </CardContent>
            </Card>
          ) : (
            purchases.map((purchase) => (
              <Card
                key={purchase.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={purchase.image || "/placeholder.svg"}
                        alt={purchase.productName}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{purchase.productName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="bg-gray-100 px-2 py-1 rounded">{purchase.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-2xl font-bold text-blue-600">
                            ${(purchase.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Purchase Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>Vendedor: {purchase.seller}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Pedido: {formatDate(purchase.orderDate)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Contactar Vendedor
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesInfo;
