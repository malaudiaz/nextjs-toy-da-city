"use client";

import React, { useEffect, useState } from "react";
import { Range } from "react-range";
import { useSearchParams } from "next/navigation";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

const MIN_PRICE = 0;
const MAX_PRICE = 500;


export default function PriceRangeFilter({ onChange }: { onChange: (values: [number, number] | null) => void }) {
  const searchParams = useSearchParams();
  const t = useTranslations("filter");
  const [values, setValues] = useState<[number, number]>(() => {
    const min = parseFloat(searchParams.get("minPrice") || String(MIN_PRICE));
    const max = parseFloat(searchParams.get("maxPrice") || String(MAX_PRICE));

    return [isNaN(min) ? MIN_PRICE : min, isNaN(max) ? MAX_PRICE : max];
  });

    useEffect(() => {
    onChange(values);
  }, [onChange, values]);



  return (
    <div className="space-y-4 px-4 py-2">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800 flex gap-1 items-center"><Coins className="size-5"/> {t("Filter2")}</h3>
      <div className="mb-2 text-md font-medium">
        ${values[0].toFixed(0)} — ${values[1].toFixed(0)}
      </div>
      </div>

      <Range
        values={values}
        step={5}
        min={MIN_PRICE}
        max={MAX_PRICE}
        onChange={(newValues) => {
          setValues(newValues as [number, number]);
        }}
        renderTrack={({ props, children }) => (
          <div {...props} className="h-2 bg-[#4c754b] w-full rounded-md">
            {children}
          </div>
        )}
        renderThumb={({ index, props }) => (
          <div
            {...props}
            key={index}
            className="focus:outline-none"
          >
            <div className="bg-white border-2 border-[#4c754b] h-6 w-6 rounded-full shadow flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#4c754b]" />
            </div>
          </div>
        )}
      />
    </div>
  );
}
