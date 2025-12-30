"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import DeleteButton from "./DeleteButton";

type Media = {
  id: string;
  fileUrl: string;
  type: "IMAGE" | "VIDEO";
  toyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Toy = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  conditionId: number;
  categoryId: number;
  forSell: boolean;
  forGifts: boolean;
  forChanges: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId: string;
  isActive: boolean;
  isFavorite: boolean;
  media: Media[];
  categoryDescription: string;
  conditionDescription: string;
  statusDescription: string;
};

type ToyCardProps = {
  toy: Toy;
};

export default function ToyCard({ toy }: ToyCardProps) {
  const t = useTranslations("configurations");

  return (
    <Card
      key={toy.id}
      className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
    >
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <Image
              src={toy.media[0].fileUrl || "/placeholder.svg"}
              alt={toy.title}
              width={150}
              height={150}
              className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {toy.title}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-2xl font-bold text-green-700">
                  {toy.price === 0 ? (
                    <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm">
                      {toy.forGifts ? t("toys.free") : t("toys.exchange")}
                    </span>
                  ) : (
                    `$${toy.price.toFixed(2)}`
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <p className="text-lg text-gray-600">{toy.description}</p>
            </div>

            <Separator />

            {toy.isActive ? (
              <div className="flex flex-row gap-4">
                <Link href={`/config/mytoys/edit/${toy.id}`}>
                  <Button className="bg-green-700 hover:bg-green-800 text-white">
                    {t("toys.edit")}
                  </Button>
                </Link>
                 <DeleteButton id={toy.id} />
              </div>
            ) : (
              <div className="text-red-600 font-semibold">  
                {t("toys.sold")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
