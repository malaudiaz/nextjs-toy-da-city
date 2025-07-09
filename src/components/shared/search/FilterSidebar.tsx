"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTranslations } from "next-intl";
import PriceRangeFilter from "../home/PriceRangeFilter";
import RadiusFilter from "../home/RadiusFilter";
import { useFilter } from "@/hooks/useFilters";

export default function FilterSidebar() {
  const t = useTranslations("filter");
  const {
    priceRange,
    radius,
    handlePriceChange,
    handleRadiusChange,
    applyFilters,
    clearFilters,
    loadingLocation,
    searchParams,
  } = useFilter();
  return (
    <div className="w-96 pt-6 ">
      <RadiusFilter onChange={handleRadiusChange} />
      <PriceRangeFilter onChange={handlePriceChange} />
      <div className="flex w-full gap-2 mt-4 p-3 justify-between">
        <Button
          type="button"
          onClick={applyFilters}
          className="bg-[#3D5D3C] text-white px-4 py-2 rounded-md flex-1"
        >
          {t("Buttom1")}
        </Button>

        {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
          <Button
            type="button"
            onClick={clearFilters}
            className="text-sm bg-[#e07a5f] hover:bg-[#bb664f]"
          >
            {t("Buttom2")}
          </Button>
        )}
      </div>
    </div>
  );
}
