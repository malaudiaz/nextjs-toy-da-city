"use client"

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

type Props = {
    conditions: Condition[]
}

export function FiltersAction({ conditions }: Props) {
  // Obtener todos los estados y handlers
  const { 
    forSell, handleForSellChange, 
    forSwap, handleForSwapChange, 
    forFree, handleForFreeChange,
    minPrice, maxPrice, handlePriceChange, 
    maxDistance, handleDistanceChange,
    conditions: activeConditionsString, handleConditionChange 
  } = useFiltersAction();
    
  const t = useTranslations("filter");
  
  // Parsear las condiciones activas para verificar el estado de los checkboxes
  const activeConditions = activeConditionsString.split(',').filter(Boolean);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filters</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 md:w-64" align="start">
        
        {/* --- Filtro por Tipo (Checkbox) --- */}
        <DropdownMenuLabel>{t("Type")}</DropdownMenuLabel>
        <DropdownMenuGroup className="flex flex-col gap-1">
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
            <Label htmlFor="forSell" className="text-sm cursor-pointer">{t("Sale")}</Label>
            <Input 
                id="forSell" 
                className="size-4 cursor-pointer" 
                type="checkbox" 
                checked={forSell}
                onChange={handleForSellChange} 
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
            <Label htmlFor="forFree" className="text-sm cursor-pointer">{t("Free")}</Label>
            <Input 
                id="forFree" 
                className="size-4 cursor-pointer" 
                type="checkbox" 
                checked={forFree}
                onChange={handleForFreeChange}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
            <Label htmlFor="forSwap" className="text-sm cursor-pointer">{t("Swap")}</Label>
            <Input 
                id="forSwap" 
                className="size-4 cursor-pointer" 
                type="checkbox" 
                checked={forSwap}
                onChange={handleForSwapChange} 
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* --- Rango de Precio (Slider) --- */}
        <DropdownMenuGroup className="px-2 py-2">
            <div className="space-y-3">
                <Label>Rango de precio</Label>
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
                <Label>Maxima Distancia</Label>
                <div className="px-2">
                    <Slider 
                        min={0}
                        max={300} 
                        step={10} 
                        value={[maxDistance]} // Usar el estado de maxDistance
                        onValueChange={handleDistanceChange} // Conectar el handler
                        className="w-full" 
                    />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>0 km</span> 
                    <span>{maxDistance} km</span>
                </div>
            </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />

        {/* --- Condición (Checkbox Múltiple) --- */}
        <DropdownMenuLabel>Condición</DropdownMenuLabel>
        <DropdownMenuGroup className="px-2 pb-2 flex flex-col gap-1">
            {conditions.map((condition) => (
                <div key={condition.id} className='flex flex-row gap-2 items-center'>
                    <Input 
                        type="checkbox" 
                        name="condition" 
                        value={condition.id}
                        className='size-4'
                        checked={activeConditions.includes(condition.id.toString())} // Verificar si está activo
                        onChange={handleConditionChange} // Conectar el handler
                    />
                    <label className='font-medium'>{condition.description}</label>
                </div>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}