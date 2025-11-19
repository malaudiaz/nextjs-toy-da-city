"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFiltersAction } from "@/hooks/useFiltersAction";
import { Condition } from "@/types/modelTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Props = {
  conditions: Condition[];
};

export function FiltersAction({ conditions }: Props) {
  const {
    forSell,
    handleForSellChange,
    forChanges,
    handleForChangesChange,
    forGifts,
    handleForGiftsChange,
    minPrice,
    maxPrice,
    handlePriceChange,
    maxDistance,
    handleDistanceChange,
    radius,
    conditions: activeConditionsString,
    handleConditionChange,
  } = useFiltersAction();

  const t = useTranslations("filter");

  const activeConditions = activeConditionsString.split(",").filter(Boolean);
  const preventClose = (e: Event) => e.preventDefault();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t("Title")}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 md:w-64" align="start">
        <div className="flex justify-between py-2">
          <DropdownMenuLabel>{t("Type")}</DropdownMenuLabel>
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => router.push("/")}
          >
            {t("Clear")}
          </Button>
        </div>
        <DropdownMenuGroup className="flex flex-col gap-1">
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer"
            onSelect={preventClose}
          >
            <Label htmlFor="forSell" className="text-sm cursor-pointer">
              {t("Sale")}
            </Label>
            <Input
              id="forSell"
              className="size-4 cursor-pointer"
              type="checkbox"
              checked={forSell}
              onChange={handleForSellChange}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer"
            onSelect={preventClose}
          >
            <Label htmlFor="forGifts" className="text-sm cursor-pointer">
              {t("Free")}
            </Label>
            <Input
              id="forGifts"
              className="size-4 cursor-pointer"
              type="checkbox"
              checked={forGifts}
              onChange={handleForGiftsChange}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer"
            onSelect={preventClose}
          >
            <Label htmlFor="forChanges" className="text-sm cursor-pointer">
              {t("Swap")}
            </Label>
            <Input
              id="forChanges"
              className="size-4 cursor-pointer"
              type="checkbox"
              checked={forChanges}
              onChange={handleForChangesChange}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* --- Rango de Precio (Slider) --- */}
        <DropdownMenuGroup className="px-2 py-2">
          <div className="space-y-3">
            <Label>{t("priceRange")}</Label>
            <div className="px-2">
              <Slider
                min={0}
                max={500}
                step={10}
                value={[maxPrice]} // Usar el estado de maxPrice
                onValueChange={handlePriceChange} // Conectar el handler
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* --- Maxima Distancia (Slider) --- */}
        <DropdownMenuGroup className="px-2 py-2">
          <div className="space-y-3">
            <Label>{t("maxDistance")}</Label>
            <div className="px-2">
              <Slider
                min={0}
                max={300}
                step={10}
                value={[radius]}
                onValueChange={handleDistanceChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>0 {t("miles")}</span>
              <span>
                {maxDistance} {t("miles")}
              </span>
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* --- Condición (Checkbox Múltiple) --- */}
        <DropdownMenuLabel>Condición</DropdownMenuLabel>
        <DropdownMenuGroup className="px-2 pb-2 flex flex-col gap-1">
          {conditions.map((condition) => (
            <DropdownMenuItem
              onSelect={preventClose}
              key={condition.id}
              className="flex flex-row gap-2 items-center"
            >
              <Input
                type="checkbox"
                name="condition"
                value={condition.id}
                className="size-4"
                checked={activeConditions.includes(condition.id.toString())} // Verificar si está activo
                onChange={handleConditionChange} // Conectar el handler
              />
              <label className="font-medium">{condition.description}</label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
