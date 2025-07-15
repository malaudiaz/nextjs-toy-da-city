import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";

interface TypeFilterProps {
  onChange: (name: string) => void;
  typeSale: boolean;
  typeFree: boolean;
  typeSwap: boolean;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  onChange,
  typeSale,
  typeFree,
  typeSwap,
}) => {
  const t = useTranslations("filter");
  return (
    <div className="space-y-2 px-4 py-2">
      <h3>{t("Type")}</h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">{t("Sale")}</Label>
          <Input
            className="size-4"
            type="checkbox"
            checked={typeSale}
            onChange={() => onChange("typeSale")}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">{t("Free")}</Label>
          <Input
            className="size-4"
            type="checkbox"
            checked={typeFree}
            onChange={() => onChange("typeFree")}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">{t("Swap")}</Label>
          <Input
            className="size-4"
            type="checkbox"
            checked={typeSwap}
            onChange={() => onChange("typeSwap")}
          />
        </div>
      </div>
    </div>
  );
};

export default TypeFilter;
