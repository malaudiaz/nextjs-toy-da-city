import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";

export const useFiltersAction = () => {
  const [lat, setLat] = useQueryState("lat", parseAsString.withOptions({ shallow: false }));
  const [lng, setLng] = useQueryState("lng", parseAsString.withOptions({ shallow: false }));
  const [radius, setRadius] = useQueryState("radius", parseAsInteger.withDefault(300).withOptions({ shallow: false }));
  const [forSell, setForSell] = useQueryState("forSell", parseAsBoolean.withOptions({ shallow: false }) );
  const [forChanges, setForChanges] = useQueryState("forChanges",parseAsBoolean.withOptions({ shallow: false }) );
  const [forGifts, setForGifts] = useQueryState( "forGifts",parseAsBoolean.withOptions({ shallow: false }));
  const [minPrice, setMinPrice] = useQueryState("minPrice",parseAsInteger.withDefault(0).withOptions({ shallow: false }));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice",parseAsInteger.withDefault(500).withOptions({ shallow: false }));
  const [maxDistance, setMaxDistance] = useQueryState("",parseAsInteger.withDefault(300).withOptions({ shallow: false }));
  const [conditions, setConditions] = useQueryState("conditions",parseAsString.withOptions({ shallow: false }));

  const handleForSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setForSell(isChecked || null);
  };

  const handleForChangesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setForChanges(isChecked || null);
  };
  const handleForGiftsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setForGifts(isChecked || null);
  };

  const handlePriceChange = (values: number[]) => {
    const newMaxPrice = values[0];
    setMaxPrice(newMaxPrice === 500 ? null : newMaxPrice);
  };

 const handleDistanceChange =  (values: number[]) => {
  const newRadius = values[0];
   setRadius(newRadius)
      navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude.toString());
      setLng(pos.coords.longitude.toString());
    });
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
    forSell: forSell || false,
    forChanges: forChanges || false,
    forGifts: forGifts || false,
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 500,
    maxDistance: maxDistance || 300,
    conditions: conditions || "",
    radius: radius || 300,

    handleForSellChange,
    handleForChangesChange,
    handleForGiftsChange,
    handlePriceChange,
    handleDistanceChange,
    handleConditionChange,
  };
};
