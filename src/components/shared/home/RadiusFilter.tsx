"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Range } from "react-range";

export default function RadiusFilter({
  onChange,
}: {
  onChange: (radius: number) => void;
}) {
  const [value, setValue] = useState<number>(50);
  const t = useTranslations("filter");
  return (
    <div className="space-y-4 px-4 py-2">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800 flex gap-1 items-center"><MapPin className="size-5"/> {t("Filter1")}</h3>

      {/* Vista del valor actual */}
      <span className="mb-2 text-md font-medium">{value} miles</span>
      </div>

      {/* Slider */}
      <Range
        values={[value]}
        step={5}
        min={10}
        max={200}
        onChange={(values) => {
          setValue(values[0]);
          onChange(values[0]);
        }}
        renderTrack={({ props, children }) => (
          <div {...props} className="h-2 bg-[#e07a5f] w-full rounded-md">
            {children}
          </div>
        )}
        renderThumb={({index, props }) => (
          <div {...props} key={index} className="focus:outline-none">
            <div className="bg-white border-2 border-[#e07a5f] h-6 w-6 rounded-full shadow flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#e07a5f]" />
            </div>
          </div>
        )}
      />
    </div>
  );
}
