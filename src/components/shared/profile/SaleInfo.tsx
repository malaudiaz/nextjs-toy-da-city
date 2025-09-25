import { Sale } from "@/types/modelTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Package } from "lucide-react";
import { SelectFilter } from "./SelectFIlter";
import { getTranslations } from "next-intl/server";

type SalesProps = {
  sales: Sale[];
};

const SaleInfo = async ({ sales }: SalesProps) => {
  const t = await getTranslations("sales");

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
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {t("emptyMsg")}
                </p>
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
                        <div className="flex flex-col gap-2">
                          <p className="text-gray-600 text-md">
                            {t("category")}: {sale.category.name}
                          </p>
                          <p className="text-gray-600 text-md">
                            {t("condition")}: {sale.condition.name}
                          </p>
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
