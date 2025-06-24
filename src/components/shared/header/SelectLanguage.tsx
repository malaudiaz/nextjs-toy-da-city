"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useLocaleSwitcher } from '@/hooks/useLocalSwitcher';


const SelectLanguage = () => {
  const switchLocale = useLocaleSwitcher();

  const [currentLocale, setCurrentLocale] = React.useState<'en' | 'es'>('en');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const locale = window.location.pathname.split('/')[1];
      if (locale === 'en' || locale === 'es') {
        setCurrentLocale(locale as 'en' | 'es');
      }
    }
  }, []);

  const handleLanguageChange = (newLocale: 'en' | 'es') => {
    setCurrentLocale(newLocale);
    switchLocale(newLocale);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="pl-2 flex items-center gap-1 text-black focus:outline-none">
          {/* Mostrar emoji según el idioma */}
          {currentLocale === 'es' ? '🇪🇸' : '🇬🇧'}
          <span>{currentLocale.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-32 bg-white border border-gray-200 rounded-md shadow-sm">
          <DropdownMenuItem
            onClick={() => handleLanguageChange('es')}
            disabled={currentLocale === 'es'}
            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 ${
              currentLocale === 'es' ? 'opacity-50 cursor-not-allowed' : ''
            } flex items-center gap-2`}
          >
            <span>🇪🇸</span>
            <span>ES</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleLanguageChange('en')}
            disabled={currentLocale === 'en'}
            className={`cursor-pointer hover:bg-gray-100 px-2 py-1 ${
              currentLocale === 'en' ? 'opacity-50 cursor-not-allowed' : ''
            } flex items-center gap-2`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectLanguage;