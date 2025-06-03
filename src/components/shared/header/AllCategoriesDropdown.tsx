"use client";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const AllCategoriesDropdown = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsSelected(open)}>
      <DropdownMenuTrigger className={`hover:bg-[#b6babe] text-white px-4 py-2 transition-colors flex items-center gap-1 ${isSelected ? "bg-[#E07A5F]" : "bg-[#CED1D4]"}`}>
        All Categories {isSelected ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-2"
        align="start"
      >
        <DropdownMenuLabel>Toys</DropdownMenuLabel>
        <DropdownMenuItem >Domino</DropdownMenuItem>
        <DropdownMenuItem>Billar</DropdownMenuItem>
        <DropdownMenuItem>Mapa</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
        <DropdownMenuItem>Parchis</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AllCategoriesDropdown;
