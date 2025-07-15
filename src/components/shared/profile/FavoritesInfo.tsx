import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, ShoppingCart, Trash2, User } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";


type FavoritesProps = {
    id: number;
    productName: string;
    price: number;
    image: string;
    seller: string;
}

const FavoritesInfo = ({ favorites }: { favorites: FavoritesProps[] }) => {
  return (
     <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <Heart className="h-5 w-5 text-red-600 fill-red-600" />
                    </div>

                    <div className="text-center space-y-3">
                      <Image
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.productName}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover w-[120px] h-[120px] mx-auto"
                      />
                      <h3 className="font-semibold text-gray-900 leading-tight">{favorite.productName}</h3>

                      <div className="space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg line-through text-gray-400">
                              €{favorite.price.toFixed(2)}
                            </span>
                          </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Vendedor: {favorite.seller}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
      </div>
    </div>
  );
};

export default FavoritesInfo;
