import { getOwnToys } from "@/lib/actions/toysAction";
import React from "react";
import ToyCard from "./ToyCard";
import { getTranslations } from "next-intl/server";

const ToyGrid = async () => {
  const t = await getTranslations("configurations");
  const toys = await getOwnToys();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("toys.title")}
          </h1>
        </div>

        <div className="space-y-6">
          {toys.map((toy) => (
            <ToyCard key={toy.id} toy={toy} />
          ))}
          {toys.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t("toys.emptyMsg")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToyGrid;
