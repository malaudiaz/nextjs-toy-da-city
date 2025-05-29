import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const Search = () => {
  return (
    <form action="" className="w-full flex  h-9 ">
      <div className="relative w-full">
        <Input
          className="flex-1 rounded-md bg-gray-100 text-black text-base h-full"
          placeholder={`look for a toy`}
          name="q"
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


