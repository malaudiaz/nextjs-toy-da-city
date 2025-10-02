"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useLocale  } from 'next-intl';
import { useLocaleSwitcher } from '@/hooks/useLocalSwitcher';
import { type Locale } from '@/i18n/routing'; // ✅ Importa el tipo aquí

const SelectLanguage = () => {
  const locale = useLocale(); // ✅ Obtiene el locale actual de next-intl
  const switchLocale = useLocaleSwitcher();


  const handleLanguageChange = (newLocale: Locale) => {
    switchLocale(newLocale);
    // No necesitas setCurrentLocale: next-intl + App Router manejan la navegación
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="pl-2 flex items-center gap-1 text-black focus:outline-none">
          {locale === 'es' ? '🇪🇸' : '🇺🇸'}
          <span>{locale.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-32 bg-white border border-gray-200 rounded-md shadow-sm">
          <DropdownMenuItem
            onClick={() => handleLanguageChange('es')}
            disabled={locale === 'es'}
            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 ${
              locale === 'es' ? 'opacity-50 cursor-not-allowed' : ''
            } flex items-center gap-2`}
          >
            <span>🇪🇸</span>
            <span>ES</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleLanguageChange('en')}
            disabled={locale === 'en'}
            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 ${
              locale === 'en' ? 'opacity-50 cursor-not-allowed' : ''
            } flex items-center gap-2`}
          >
            <span>🇺🇸</span>
            <span>EN</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectLanguage;