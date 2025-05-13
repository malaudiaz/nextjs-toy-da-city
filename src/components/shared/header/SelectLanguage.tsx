"use client"
import React, { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { revalidatePath } from 'next/cache';
  

const SelectLanguage = () => {
    // Estado para guardar el idioma actual (por defecto: inglés "EN")
    const [currentLanguage, setCurrentLanguage] = useState<"EN" | "ES">("EN");
  
    // Función para alternar entre idiomas
    const toggleLanguage = () => {
      setCurrentLanguage(currentLanguage === "EN" ? "ES" : "EN");
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="pl-2 flex items-center gap-1 text-white focus:outline-none">
          {currentLanguage}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-20 bg-white border border-gray-200 rounded-md shadow-sm">
          {/* Botón para cambiar a Español (si está en inglés) o viceversa */}
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-gray-100"
            onClick={toggleLanguage}
          >
            {currentLanguage === "EN" ? "ES" : "EN"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

export default SelectLanguage
