import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Package } from "lucide-react";
import { Sale } from "@/types/modelTypes";

type FreeProps = {
  free: Sale[];
};

const FreeInfo = ({ free }: FreeProps) => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Juguetes para Regalar
          </h1>
        </div>

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {free.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No se encontraron ventas con los filtros seleccionados
                </p>
              </CardContent>
            </Card>
          ) : (
            free.map((gift) => (
              <Card
                key={gift.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={gift.media[0].fileUrl || "/placeholder.svg"}
                        alt={gift.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {gift.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-2"></div>
                      </div>

                      <Separator />
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

export default FreeInfo;
