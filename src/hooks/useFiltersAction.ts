import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useGeolocation } from "./useGeolocation";
import { useEffect, useState } from "react";

export const useFiltersAction = () => {
  const [forSale, setForSell] = useQueryState(
    "forSale",
    parseAsBoolean.withOptions({ shallow: false })
  );
  const [forSwap, setForSwap] = useQueryState(
    "forSwap",
    parseAsBoolean.withOptions({ shallow: false })
  );
  const [forFree, setForFree] = useQueryState(
    "forFree",
    parseAsBoolean.withOptions({ shallow: false })
  );

  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0).withOptions({ shallow: false })
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(500).withOptions({ shallow: false })
  );

  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsInteger.withDefault(300).withOptions({ shallow: false })
  );
  const { latitude, longitude } = useGeolocation();
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    if (!hasLocation && latitude && longitude) {
      setHasLocation(true);
    }
  }, [latitude, longitude, hasLocation]);

  const [conditions, setConditions] = useQueryState(
    "conditionId",
    parseAsString.withOptions({ shallow: false })
  );

  const handleForSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setForSell(isChecked || null);

    if (isChecked) {
      setForSwap(false);
      setForFree(false);
    }
  };

  const handleForSwapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setForSwap(isChecked || null);

    if (isChecked) {
      setForSell(false);
      setForFree(false);
    }
  };
  const handleForFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setForFree(isChecked || null);

    if (isChecked) {
      setForSell(false);
      setForSwap(false);
    }
  };

  const handlePriceChange = (values: number[]) => {
    const newMaxPrice = values[0];
    setMaxPrice(newMaxPrice === 500 ? null : newMaxPrice);
  };

  const handleDistanceChange = (values: number[]) => {
    const newMaxDistance = values[0];
    setMaxDistance(newMaxDistance === 300 ? null : newMaxDistance);
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const conditionId = e.target.value;
    const isChecked = e.target.checked;

    const currentConditions = conditions ? conditions.split(",") : [];
    let newConditions: string[];

    if (isChecked) {
      newConditions = [...currentConditions, conditionId];
    } else {
      newConditions = currentConditions.filter((id) => id !== conditionId);
    }
    setConditions(newConditions.length > 0 ? newConditions.join(",") : null);
  };

  return {
    forSell: forSale || false,
    forSwap: forSwap || false,
    forFree: forFree || false,
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 500,
    maxDistance: maxDistance || 300,
    conditions: conditions || "",

    handleForSellChange,
    handleForSwapChange,
    handleForFreeChange,
    handlePriceChange,
    handleDistanceChange,
    handleConditionChange,
  };
};
