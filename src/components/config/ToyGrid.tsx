"use client"; 

import React from "react";
import ToyCard from "./ToyCard";
import Empty from "../shared/Empty";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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

// Define las props correctamente para ToyGrid
interface ToyGridProps {
  toys: Toy[];
}

const ToyGrid = ({ toys }: ToyGridProps) => {
  const t = useTranslations("configurations");

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pl-4 pb-4">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("toys.title")}
          </h1>
        </div>

        <div className="space-y-6">
          {toys.map((toy) => (
            <ToyCard key={toy.id} toy={toy} />
          ))}
          {toys.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Empty title={t("toys.title")} subtitle={t("toys.emptyMsg")} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToyGrid;