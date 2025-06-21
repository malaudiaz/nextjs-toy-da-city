"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {

const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
    const currentQuery = searchParams.get('search') || '';
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const current = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) {
      current.set('search', searchQuery);
    } else {
      current.delete('search');
    }

    router.push(`?${current.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex  h-9 ">
      <div className="relative w-full">
        <Input
          className="flex-1 rounded-md bg-gray-100 text-black text-base h-full"
          placeholder={`look for a toy`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
        />
        <Button
      type="submit"
      className="rounded-md bg-[#e07a5f] hover:bg-[#bb664f] h-full px-3 py-2 absolute right-0 top-0"
    >
      <SearchIcon className="w-6 h-6 text-white" />
    </Button> 
      </div>
    </form>
  );
};

export default Search;


