"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";
    setInputValue(currentQuery);
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const applySearch = () => {
    const current = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      current.set("search", inputValue.trim());
    } else {
      current.delete("search");
    }

    router.push(`?${current.toString()}`);
    setSearchQuery(inputValue);
  };

  const clearSearch = () => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete("search");
    router.push(`?${current.toString()}`);
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); applySearch(); }} className="w-full flex h-9">
      <div className="relative w-full">
        <Input
          className="flex-1 rounded-md bg-gray-100 text-black text-base h-full pl-4 pr-10"
          placeholder="Search toys..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
        />

        {/* Botón de limpiar */}
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

        {/* Botón de buscar */}
          <Button
            type="submit"
            className="rounded-md bg-[#e07a5f] hover:bg-[#bb664f] h-full px-3 py-2 top-0 right-0 absolute"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>

      </div>
    </form>
  );
};

export default Search;