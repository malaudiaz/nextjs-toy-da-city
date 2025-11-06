"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Search = () => {
  const t = useTranslations("navbar");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Detecta si es móvil o desktop
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const [inputValue, setInputValue] = useState("");
  const [, setSearchQuery] = useState("");

  // Cargar valor inicial desde URL
  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";
    setInputValue(currentQuery);
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const applySearch = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("page");

    if (inputValue.trim()) {
      current.set("search", inputValue.trim());
    } else {
      current.delete("search");
    }

    if (isMobile) {
      router.push(`?${current.toString()}`);
    } else {
      const locale = pathname.split("/")[1];
      router.push(`/${locale}/search?${current.toString()}`);
    }

    setSearchQuery(inputValue);
  };

  const clearSearch = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("search");

    const locale = pathname.split("/")[1];

    router.push(`/${locale}?${current.toString()}`);

    setInputValue("");
    setSearchQuery("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applySearch();
      }}
      className="w-full flex h-9"
    >
      <div className="relative w-full">
        <Input
          className="flex-1 rounded-md bg-gray-100 text-black text-base h-full pl-4 pr-10"
          placeholder={t("Search")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
        />

        {/* Botón limpiar */}
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Limpiar búsqueda"
            className="absolute right-8 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Botón buscar */}
        <Button
          type="submit"
          className="rounded-md bg-[#e07a5f] hover:bg-[#bb664f] h-full px-3 py-2 absolute right-0 top-0"
        >
          <SearchIcon className="h-5 w-5 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default Search;
