"use client"; 

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { SelectFilter } from "./SelectFIlter";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import { Calendar, User } from "lucide-react";
import { Prisma } from '@prisma/client'
import Empty from "../Empty";

type Sale = Prisma.ToyGetPayload<{
  include: {
    media: true
    category: true
    condition: true
    status: true
    seller: { select: { id: true; name: true; email: true } }
    orderItems: { 
      include: { 
        order: { 
          include: { 
            buyer: { select: { id: true; name: true; email: true } } 
          } 
        } 
      } 
    }
  }
}>

type SalesProps = {
  sales: Sale[]
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SaleInfo = ({ sales }: SalesProps) => {
  const t = useTranslations("sales");

  const options = [
    { id: "ALL", name: t("all") },
    { id: "available", name: t("available") },
    { id: "reserved", name: t("reserved") },
    { id: "sold", name: t("sold") },
    { id: "canceled", name: t("canceled") },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <SelectFilter options={options} route="sales" />
        </div>

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {sales.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Empty title={t("title")} subtitle={t("emptyMsg")} />
              </CardContent>
            </Card>
          ) : (
            sales.map((sale) => (
              <Card
                key={sale.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={sale.media[0].fileUrl || "/placeholder.svg"}
                        alt={sale.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {sale.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-2xl font-bold text-green-700">
                            ${sale.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Separator />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg text-gray-600">
                          {sale.description}
                        </p>
                        <div className="flex flex-row gap-2">
                          <p className="text-gray-600 text-md">
                            {t("status")}: 
                          </p>
                          <p className="text-red-600 font-semibold">{t(sale.status.name)}</p>                          
                        </div>
                      </div>

                      <Separator />

                      {/* Purchase Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{t("buyer")}: {sale.orderItems[0].order.buyer.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{t("order")}: {formatDate(sale.orderItems[0].order.createdAt.toString())}</span>
                          </div>
                        </div>
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

export default SaleInfo;
