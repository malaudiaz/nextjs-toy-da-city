import { Facebook, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full h-full mt-auto bg-[#24272A]'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  py-10'>
       <div className='grid grid-cols-2 gap-4 place-items-center'>
          <div className='flex flex-col space-y-1'>
          <Image src={'/Logo2.png'} alt={'Toy'} width={118} height={23} />
          <Link href={"/"} className='text-white font-medium'>Our mission</Link>
          <Link href={"/"} className='text-white font-medium'>Contact</Link>
          </div>
          <div className='flex flex-col space-y-1'>
            <Link href={"/"} className='text-white font-medium'>▸ Swap</Link>
            <Link href={"/"} className='text-white font-medium'>▸ Give a gift</Link>
            <Link href={"/"} className='text-white font-medium'>▸ Buy/Sell</Link>
          </div>
       </div>
      </div>
      <div className='flex items-center justify-center gap-2 w-full'>
          <Link href={"/"} className='text-white font-medium'> <Facebook/> </Link>
          <Link href={"/"} className='text-white font-medium'> <Instagram/> </Link>
          <Link href={"/"} className='text-white font-medium'> <Youtube/> </Link>
      </div>
      <div className='flex items-center justify-center gap-2 w-full mt-1'>
          <Link href={"/terms"} className='text-white border-r-2 border-white/50 pr-2'> Terms of use</Link>
          <Link href={"/policies"} className='text-white border-r-2 border-white/50 pr-2'>Privacy policy</Link>
          <Link href={"/deletedata"} className='text-white'>Delete data</Link>
      </div>
           <span className='text-white border-r-2 border-white/50 flex justify-center mt-1'>© 2025 Toydacity</span>
    </div>
  )
}

export default Footer
