import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'

const Search = () => {
  return (
    <form action="" className="w-full flex  items-stretch h-9 ">
        <Input
      className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
      placeholder={`look for a toy`}
      name="q"
      type="search"
    />
    <button
      type="submit"
      className="test2 text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2 "
    >
      <SearchIcon className="w-6 h-6" />
    </button>
  </form>
  )
}

export default Search