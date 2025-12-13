"use client";

import Image from "next/image";
import { Calendar, User, Tag, Package } from "lucide-react"; // Importamos iconos adicionales
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Añadimos CardHeader
import { Separator } from "@/components/ui/separator";
import { SelectFilter } from "./SelectFIlter";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { ConfirmOrderDialog } from "./ConfirmOrderDialog";
import Empty from "../Empty";
import { Order } from "@/types/modelTypes";

// ... (formatDate, PurchaseProps, fromCents se mantienen igual) ...
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type PurchaseProps = {
  orders: Order[];
};

const fromCents = (cents: number) => cents / 100;

const PurchasesInfo = ({ orders }: PurchaseProps) => {
  const t = useTranslations("purchases");

  const options = [
    { id: "ALL", name: t("ALL") },
    { id: "AWAITING_CONFIRMATION", name: t("AWAITING_CONFIRMATION") },
    { id: "CONFIRMED", name: t("CONFIRMED") },
    { id: "CANCELED", name: t("CANCELED") },
    { id: "TRANSFERRED", name: t("TRANSFERRED") },
    { id: "REEMBURSED", name: t("REEMBURSED") },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <SelectFilter options={options} route="purchases" />
        </div>

        {/* Purchases List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Empty title={t("title")} subtitle={t("emptyMsg")} />
              </CardContent>
            </Card>
          ) : (
            // 🎯 Mapeo Principal: UNA TARJETA POR ORDEN
            orders.map((order) => (
              <Card
                key={order.id} // La clave es el ID de la ORDEN
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* --- 1. CABECERA DE LA ORDEN (ID, ESTADO, PRECIO TOTAL) --- */}
                <CardHeader className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-center gap-4">
                      {/* ID y Fecha */}
                      <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        **{t("orderNumber")}: {order.id.substring(0, 8)}**
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-right">
                      {/* ESTADO */}
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                          order.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "AWAITING_CONFIRMATION"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        **{t(order.status)}**
                      </span>
                      {/* PRECIO TOTAL */}
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ${fromCents(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* --- 2. DETALLE DE LOS ITEMS --- */}
                <CardContent className="p-4 md:p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t("itemsTitle")} ({order.items.length})
                  </h3>
                  <Separator />

                  {/* Mapeo de ITEMS dentro de la ORDEN */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-center border-b pb-4 last:border-b-0 last:pb-0"
                      >
                        {/* Foto del Juguete */}
                        <Image
                          src={item.toy.media[0]?.fileUrl || "/placeholder.svg"}
                          alt={item.toy.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover w-[80px] h-[80px] flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Nombre del Juguete */}
                          <Link
                            href={`/toys/${item.toy.id}`}
                            className="text-base font-medium text-blue-600 hover:underline truncate"
                          >
                            {item.toy.title}
                          </Link>
                          {/* Vendedor */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <User className="h-4 w-4" />
                            <span>
                              {t("seller")}:{" "}
                              <Link
                                href={`/seller/${item.toy.sellerId}`}
                                className="font-medium hover:underline"
                              >
                                {item.toy.seller?.name}
                              </Link>
                            </span>

                            {/* ✅ APLICACIÓN DE LA CONDICIÓN DE ELEGIBILIDAD */}

                            {item.toy.seller.isEligibleForReview && ( // <--- SOLO MUESTRA SI ES ELEGIBLE

                              <>
                                {/* Separador visual (opcional) */}
                                <span className="text-gray-400">|</span>

                                {/* Enlace para Reseñar al Vendedor */}
                                <Link
                                  href={`/reviews/${item.toy.sellerId}`} // URL solicitada
                                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
                                >
                                  (
                                  {t("reviewSellerLinkText") ||
                                    "Reseñar vendedor"}
                                  )
                                </Link>
                              </>
                            )}
                            
                          </div>
                        </div>

                        {/* Precio del Item */}
                        <div className="text-lg font-bold text-green-700 flex-shrink-0">
                          ${fromCents(item.priceAtPurchase).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* --- 3. BOTONES DE ACCIÓN (Nivel de Orden) --- */}
                  {order.status === "AWAITING_CONFIRMATION" && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:justify-end">
                      {" "}
                      {/* <<-- CAMBIO CLAVE */}
                      <CancelOrderDialog
                        orderId={order.id}
                        btnText={t("cancelBtn")}
                        msgsuccess={t("cancelSuccess")}
                        msgerror={t("cancelError")}
                      />
                      <ConfirmOrderDialog
                        orderId={order.id}
                        btnText={t("confirmBtn")}
                        msgsuccess={t("confirmSuccess")}
                        msgerror={t("confirmError")}
                      />
                    </div>
                  )}
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
