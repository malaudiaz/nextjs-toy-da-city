'use client';

import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PriceRangeFilter from "./PriceRangeFilter";
import { useGeolocation } from "@/hooks/useGeolocation";
import RadiusFilter from "./RadiusFilter";
import { useTranslations } from "next-intl";
import TypeFilter from "./TypeFilter";
import ConditionFilter from "../search/ConditionFilter";
import { Condition } from "@/types/modelTypes";

type Props = {
  conditions: Condition[];
};

export default function FilterBar({ conditions }: Props) {
  const t = useTranslations("filter");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = parseFloat(searchParams.get("minPrice") || "0");
    const max = parseFloat(searchParams.get("maxPrice") || "500");
    return [isNaN(min) ? 0 : min, isNaN(max) ? 500 : max];
  });
  const [radius, setRadius] = useState<number>(
    parseFloat(searchParams.get("radius") || "50")
  );
  const [isOpen, setIsOpen] = useState(false);
  const { latitude, longitude, getLocationAsync } = useGeolocation();
  const [hasLocation, setHasLocation] = useState(false);
  const [typeSale, setTypeSale] = useState(false);
  const [typeFree, setTypeFree] = useState(false);
  const [typeSwap, setTypeSwap] = useState(false);
  const [selections, setSelections] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isOpen && !hasLocation) {
      getLocationAsync()
        .then(() => setHasLocation(true))
        .catch(() => {});
    }
  }, [getLocationAsync, hasLocation, isOpen]);

  const applyFilters = () => {
    const current = new URLSearchParams(searchParams.toString());

    if (priceRange[0] > 0) {
      current.set("minPrice", String(priceRange[0]));
    } else {
      current.delete("minPrice");
    }

    if (priceRange[1] < 500 && priceRange[1] > priceRange[0]) {
      current.set("maxPrice", String(priceRange[1]));
    } else {
      current.delete("maxPrice");
    }
    if (latitude && longitude && radius >= 10) {
      current.set("lat", String(latitude));
      current.set("lng", String(longitude));

      if (radius !== 50) {
        current.set("radius", String(radius));
      } else {
        current.delete("radius");
      }
    } else {
      current.delete("lat");
      current.delete("lng");
      current.delete("radius");
    }

    if (typeSale || typeFree || typeSwap) {
      current.set("forSale", typeSale.toString());
      current.set("forFree", typeFree.toString());
      current.set("forSwap", typeSwap.toString());
    } else {
      current.delete("forSale");
      current.delete("forFree");
      current.delete("forSwap");
    }

    if (selections.length > 0) {
      current.set("conditions", selections.join(","));
    } else {
      current.delete("conditions");
    }

    router.push(`?${current.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("minPrice");
    current.delete("maxPrice");
    current.delete("lat");
    current.delete("lng");
    current.delete("radius");
    setTypeSale(false);
    setTypeFree(false);
    setTypeSwap(false);

    setSelections([]);

    setPriceRange([0, 500]);
    router.push(`?${current.toString()}`);
    setIsOpen(false);
  };

  const handlePriceChange = (values: [number, number] | null) => {
    if (values) {
      setPriceRange(values);
    }
  };
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  const handleTypeChange = (name: string) => {
    setTypeSale(false);
    setTypeFree(false);
    setTypeSwap(false);

    if (name === "typeSale") {
      setTypeSale(true);
    }
    if (name === "typeFree") {
      setTypeFree(true);
    }
    if (name === "typeSwap") {
      setTypeSwap(true);
    }
  };

  const handleConditionChange = (id: number) => {
    const newConditions = [...selections];
    if (!newConditions.includes(id)) {
      newConditions.push(id);
    } else {
      newConditions.splice(newConditions.indexOf(id), 1);
    }
    setSelections(newConditions);
  }

  // Contenido de los filtros (reutilizable)
  const FilterContent = () => (
    <div className="space-y-4 p-4">
      <TypeFilter onChange={handleTypeChange} typeSale={typeSale} typeFree={typeFree} typeSwap={typeSwap} />
      {typeSale && <PriceRangeFilter onChange={handlePriceChange} />}
      <RadiusFilter onChange={handleRadiusChange} />
      <ConditionFilter data={conditions} selections={selections} onChange={handleConditionChange} />

      <div className="flex w-full gap-2 mt-4 justify-between">
        <Button
          type="button"
          onClick={applyFilters}
          className="bg-[#3D5D3C] text-white px-4 py-2 rounded-md flex-1"
        >
          {t("Buttom1")}
        </Button>

        {(searchParams.get("minPrice") ||
          searchParams.get("maxPrice")) && (
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

  // Versión móvil - Modal/Drawer
  if (isMobile) {
    return (
      <>
        {/* Botón para abrir filtros en móvil */}
        <div className="w-full px-1 sm:px-6 mt-4 md:hidden">
          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex gap-1 items-center w-full justify-center"
          >
            {t("Title")} <Filter className="size-4" />
          </Button>
        </div>

        {/* Modal para móvil */}
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Fondo oscuro */}
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel de filtros */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                <h3 className="text-lg font-semibold">{t("Title")}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Contenido de filtros */}
              <FilterContent />
            </div>
          </div>
        )}

        {/* Versión desktop (oculta en móvil) */}
        <div className="hidden md:block w-full px-1 sm:px-6 mt-4">
          <div className="relative inline-block text-left">
            <Button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex gap-1 items-center"
            >
              {t("Title")} <Filter className="size-4" />
            </Button>

            {isOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <FilterContent />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Versión solo desktop (para SSR o cuando isMobile es false)
  return (
    <div className="w-full px-1 sm:px-80 mt-4">
      <div className="relative inline-block text-left">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex gap-1 items-center"
        >
          {t("Title")} <Filter className="size-4" />
        </Button>

        {isOpen && (
          <div className="origin-top-left absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <FilterContent />
          </div>
        )}
      </div>
    </div>
  );
}