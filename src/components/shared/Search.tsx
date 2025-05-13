import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const Search = () => {
  return (
    <form action="" className="w-[646px] flex  h-9 ">
        <Input
      className="flex-1 rounded-none bg-gray-100 text-black text-base h-full"
      placeholder={`look for a toy`}
      name="q"
      type="search"
    />
    <Button
      type="submit"
      className="bg-white rounded-none h-full px-3 py-2 "
    >
      <SearchIcon className="w-6 h-6 text-gray-500" />
    </Button>
  </form>
  )
}

export default Search