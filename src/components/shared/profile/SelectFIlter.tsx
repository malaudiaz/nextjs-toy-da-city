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

type Options = {
  id: string,
  name: string
}

type Props = {
  options: Options[];
  route: string
}

export function SelectFilter({ options, route }: Props) {
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

    console.log(`/config/${route}?${params.toString()}`);

    router.push(`/config/${route}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleValueChange} value={currentStatus}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))
          }
          </SelectGroup>
      </SelectContent>
    </Select>
  );
}