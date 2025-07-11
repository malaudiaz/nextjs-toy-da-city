"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import PriceRangeFilter from "../home/PriceRangeFilter";
import RadiusFilter from "../home/RadiusFilter";
import { useFilter } from "@/hooks/useFilters";
import Breadcrumbs from "../BreadCrumbs";
import TypeFilter from "../home/TypeFilter";
import { Condition } from "@/types/modelTypes";
import ConditionFilter from "./ConditionFilter";

type Props = {
  conditions: Condition[];
};

export default function FilterSidebar({ conditions }: Props) {
  const t = useTranslations("filter");
  const {
    handlePriceChange,
    handleRadiusChange,
    applyFilters,
    clearFilters,
    searchParams,
  } = useFilter();
  return (
    <div className="w-96 pt-6 shadow-md px-4">
      <Breadcrumbs />
      <RadiusFilter onChange={handleRadiusChange} />
      <PriceRangeFilter onChange={handlePriceChange} />
      <TypeFilter/>
      <ConditionFilter data={conditions} />
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
