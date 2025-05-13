import { Button } from '@/components/ui/button'
import { Headset, Info, MapPin, Phone, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AllCategoriesDropdown from './AllCategoriesDropdown'

const BottomNavbar = () => {
  return (
    <div className='bg-white w-full border-b-1 border-gray-200 py-2'>
      <nav className='mx-auto max-w-7xl flex justify-between items-center py-2'>
        <div className='flex items-center gap-2'>
        <AllCategoriesDropdown/>
        <Button className='rounded-none bg-white text-gray-400 hover:bg-gray-100 px-4 py-5 shadow-none'>
            <Link href={"/"} className='flex gap-1'> <MapPin/> Track Order</Link>
        </Button>
        <Button className='rounded-none bg-white text-gray-400 hover:bg-gray-100 px-4 py-5 shadow-none'>
            <Link href={"/"} className='flex gap-1'> <RefreshCcw/> Compare</Link>
        </Button>
        <Button className='rounded-none bg-white text-gray-400 hover:bg-gray-100 px-4 py-5 shadow-none'>
            <Link href={"/"} className='flex gap-1'> <Headset/> Customer Support</Link>
        </Button>
        <Button className='rounded-none bg-white text-gray-400 hover:bg-gray-100 px-4 py-5 shadow-none'>
            <Link href={"/"} className='flex gap-1'> <Info/> Need Help</Link>
        </Button>
        </div>
        <p className='flex gap-1 text-gray-500'><Phone className='text-gray-400'/> +1 (555) 555-5555</p>
      </nav>
    </div>
  )
}

export default BottomNavbar
