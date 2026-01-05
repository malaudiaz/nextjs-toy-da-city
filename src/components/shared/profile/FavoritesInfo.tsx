"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/modelTypes";
import { useFavorite } from "@/hooks/useFavorite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import Link from "next/link";
import Empty from "../Empty";

type FavoritesProps = {
  favorites: Sale[];
};

const FavoritesInfo = ({ favorites }: FavoritesProps) => {
  const t = useTranslations("favorites"); // ✅ Usa el hook

  const router = useRouter();
  const { addToFavorites } = useFavorite();

  const handleFavorite = async (id: string) => {
    try {
      const res = await addToFavorites(id);

      if (res.data) {
        toast.success(
          !favorites.find((favorite) => favorite.id === id)
            ? t("addToFavorites")
            : t("removeFromFavorites")
        );
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(t("failedAddToFavorites"));
    }
  };

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
          {favorites.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Empty title={t("title")} subtitle={t("emptyMsg")} />
              </CardContent>
            </Card>
          ) : (
            favorites.map((favorite) => (
              <Link
                key={favorite.id}
                href={`/toys/${favorite.id}`}
                aria-label={`Ver detalles de ${favorite.description}`}
              >
                <Card
                  key={favorite.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {favorite.media[0].type === "IMAGE" && (
                          <Image
                            src={favorite.media[0].fileUrl}
                            alt={favorite.title}
                            width={400}
                            height={400}
                            className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                          />
                        )}

                        {favorite.media[0].type === "VIDEO" && (
                          <video
                            src={favorite.media[0].fileUrl}
                            className="rounded-lg w-40 h-40 object-cover border bg-black"
                            //controls
                            muted // opcional, útil si múltiples videos
                          />
                        )}
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
                          {t("btnText")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesInfo;
