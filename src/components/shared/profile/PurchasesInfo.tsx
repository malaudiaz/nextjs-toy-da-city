import Image from "next/image";
import { Calendar, Package, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/modelTypes";
import { SelectFilter } from "./SelectFIlter";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { ConfirmOrderDialog } from "./ConfirmOrderDialog";

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

const PurchasesInfo = async ({ orders }: PurchaseProps) => {
  const t = await getTranslations("purchases");

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

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {t("emptyMsg")}
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) =>
              order.items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.toy.media[0].fileUrl || "/placeholder.svg"}
                          alt={item.toy.title}
                          width={150}
                          height={150}
                          className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {item.toy.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              {t(order.status)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-2xl font-bold text-green-700">
                              ${fromCents(item.priceAtPurchase).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Purchase Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{t("seller")}: <Link href={`/seller/${order.seller.id}`}>{order.seller.name}</Link></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{t("order")}: {formatDate(order.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {order.status === "AWAITING_CONFIRMATION" && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <CancelOrderDialog orderId={order.id} btnText={t("cancelBtn")} msgsuccess={t("cancelSuccess")} msgerror={t("cancelError")} />
                            <ConfirmOrderDialog orderId={order.id} btnText={t("confirmBtn")} msgsuccess={t("confirmSuccess")} msgerror={t("confirmError")} />
                          </div>
                        )}

                        {order.status === "CONFIRMED" && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/reviews/[sellerId]" as={`/reviews/${order.seller.id}`} className="text-emerald-600 font-medium">
                              {t("review")}
                            </Link>
                          </div>
                        )}


                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesInfo;
