import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

export function useFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeSale, setTypeSale] = useState(false);
  const [typeFree, setTypeFree] = useState(false);
  const [typeSwap, setTypeSwap] = useState(false);
  const [selections, setSelections] = useState<number[]>([]);

  // Estados para precios
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = parseFloat(searchParams.get("minPrice") || "0");
    const max = parseFloat(searchParams.get("maxPrice") || "500");

    return [isNaN(min) ? 0 : min, isNaN(max) ? 500 : max];
  });

  // Estado para radio
  const [radius, setRadius] = useState<number>(
    parseFloat(searchParams.get("radius") || "50")
  );

  // Geolocalización
  const { latitude, longitude } = useGeolocation();
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    if (!hasLocation && latitude && longitude) {
      setHasLocation(true);
    }
  }, [latitude, longitude, hasLocation]);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    const current = new URLSearchParams(searchParams.toString());

    // Precio mínimo
    if (priceRange[0] > 0) {
      current.set("minPrice", String(priceRange[0]));
    } else {
      current.delete("minPrice");
    }

    // Precio máximo
    if (priceRange[1] < 500 && priceRange[1] > priceRange[0]) {
      current.set("maxPrice", String(priceRange[1]));
    } else {
      current.delete("maxPrice");
    }

    // Radio + Ubicación
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
  }, [priceRange, radius, latitude, longitude, router, searchParams]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
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
    setRadius(50);

    router.push(`?${current.toString()}`);
  }, [router, searchParams]);

  // Solo actualiza valores locales sin aplicar filtros
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
  };

  return {
    searchParams,
    priceRange,
    setPriceRange,
    radius,
    setRadius,
    handlePriceChange,
    handleRadiusChange,
    applyFilters,
    clearFilters,
    handleConditionChange,
    handleTypeChange,
    typeFree,
    typeSale,
    typeSwap,
    selections,
    hasLocation: hasLocation || false,
    loadingLocation: !hasLocation && !latitude && !longitude,
  };
}
