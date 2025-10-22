import Image from "next/image";
import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sale } from "@/types/modelTypes";
import { getTranslations } from "next-intl/server";

type SwapProps = {
  swaps: Sale[];
};

const SwapInfo = async ({ swaps }: SwapProps) => {
  const t = await getTranslations("swap"); // o el namespace que uses

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
        </div>

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {swaps.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t("emptyMsg")}</p>
              </CardContent>
            </Card>
          ) : (
            swaps.map((swap) => (
              <Card
                key={swap.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={swap.media[0].fileUrl || "/placeholder.svg"}
                        alt={swap.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {swap.title}
                          </h3>
                        </div>
                      </div>

                      <Separator />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg text-gray-600">
                          {swap.description}
                        </p>
                        <div className="flex flex-row gap-2">
                          <p className="text-gray-600 text-md">
                            {t("category")}: {swap.category.description}
                          </p>
                          <p className="text-gray-600 text-md">
                            {t("condition")}: {swap.condition.description}
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

export default SwapInfo;
