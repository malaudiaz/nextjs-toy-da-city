"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function SelectFilter() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const currentStatus = searchParams.get("status") || "ALL";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    router.push(`/config/compras?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleValueChange} value={currentStatus}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="AWAITING_CONFIRMATION">Pendiente de confirmación</SelectItem>
          <SelectItem value="CONFIRMED">Confirmada</SelectItem>
          <SelectItem value="CANCELED">Cancelada</SelectItem>
          <SelectItem value="TRANSFERRED">Transferida</SelectItem>
          <SelectItem value="REEMBURSED">Reembolsada</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}