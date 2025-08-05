"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, Package,  User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
type SaleProps = {
    id: number;
    productName: string;
    price: number;
    image: string;
    description: string;

}
type CompletedSaleProps = {
    id: number;
    productName: string;
    price: number;
    image: string;
    buyer: string;
    saleDate: string;
}

const SaleInfo = ({ salesInProgress, completedSales }: { salesInProgress: SaleProps[], completedSales: CompletedSaleProps[] }) => {
    const t = useTranslations("sales")
 const [activeTab, setActiveTab] = useState("in-progress")

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("Title")}</h1>
        </div>
  

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="in-progress" className="text-sm md:text-base">
              En Progreso ({salesInProgress.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm md:text-base">
              Completadas ({completedSales.length})
            </TabsTrigger>
          </TabsList>

          {/* Ventas en Progreso */}
          <TabsContent value="in-progress" className="space-y-4">
            {salesInProgress.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t("NoSales")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {salesInProgress.map((sale) => (
                  <Card
                    key={sale.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start">
                        <CardTitle className="text-lg font-semibold text-gray-900">{sale.productName}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={sale.image || "/placeholder.svg"}
                            alt={sale.productName}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover w-full sm:w-[120px] h-[120px]"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">€{sale.price.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <p>{sale.description}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          {t("ViewDetails")}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            {t("EditProduct")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ventas Completadas */}
          <TabsContent value="completed" className="space-y-4">
            {completedSales.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t("NoSalesCompleted")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {completedSales.map((sale) => (
                  <Card
                    key={sale.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{sale.productName}</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completada
                        </Badge>
                      </div>

                      <div className="flex flex-col items-center space-y-3">
                        <Image
                          src={sale.image || "/placeholder.svg"}
                          alt={sale.productName}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover w-[120px] h-[120px]"
                        />

                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-green-600">€{sale.price.toFixed(2)}</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{t("Buyer")}: {sale.buyer}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{t("SaleDate")}: {formatDate(sale.saleDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SaleInfo
