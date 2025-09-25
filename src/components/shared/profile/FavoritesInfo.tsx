"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/modelTypes";
import { useFavorite } from "@/hooks/useFavorite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl'; // ✅ Importa el hook

type FavoritesProps = {
  favorites: Sale[];
};

const FavoritesInfo = ({ favorites }: FavoritesProps) => {
  const t = useTranslations('favorites'); // ✅ Usa el hook

  const router = useRouter();
  const { addToFavorites } = useFavorite();

  const handleFavorite = async (id: string) => {
    try {
      const res = await addToFavorites(id);

      if (res.data) {
        toast.success(
          !favorites.find((favorite) => favorite.id === id)
            ? t('addToFavorites')
            : t('removeFromFavorites')
        );
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(t('failedAddToFavorites'));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
        </div>

        {/* Stats Cards */}
        {/* Purchases List */}
        <div className="space-y-6">
          {favorites.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('emptyMsg')}</p>
              </CardContent>
            </Card>
          ) : (
            favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={favorite.media[0].fileUrl || "/placeholder.svg"}
                        alt={favorite.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {favorite.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="ext-2xl font-bold text-green-700">
                            ${favorite.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex flex-col gap-2">
                        <p className="text-lg text-gray-600">
                          {favorite.description}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleFavorite(favorite.id)}
                        variant="outline"
                        size="sm"
                        className="mt-10 py-5 bg-transparent"
                      >
                        {t('btnText')}
                      </Button>
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

export default FavoritesInfo;
