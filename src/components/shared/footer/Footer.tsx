import { Facebook, FacebookIcon, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full h-full mt-auto bg-[#24272A]'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  py-10'>
       <div className='grid grid-cols-3 gap-4'>
          <div className='flex flex-col space-y-1'>
          <Image src={'/Logo2.png'} alt={'Toy'} width={118} height={23} />
          <Link href={"/"} className='text-white font-medium'>Our mission</Link>
          <Link href={"/"} className='text-white font-medium'>Contact</Link>
          </div>
          <div className='flex flex-col space-y-1'>
            <h1 className='font-bold text-white'>BUY/SELL</h1>
            <Link href={"/"} className='text-white font-medium'>How it works</Link>
            <Link href={"/"} className='text-white font-medium'>Pricing</Link>
            <Link href={"/"} className='text-white font-medium'>Safety tips</Link>
          </div>
          <div className='flex flex-col space-y-1'>
            <h1 className='font-bold text-white'>SWAP</h1>
            <Link href={"/"} className='text-white font-medium'>How to swap</Link>
            <Link href={"/"} className='text-white font-medium'>Value guide</Link>
          </div>
       </div>
      </div>
      <div className='flex items-center justify-center gap-2 w-full'>
          <Link href={"/"} className='text-white font-medium'> <Facebook/> </Link>
          <Link href={"/"} className='text-white font-medium'> <Instagram/> </Link>
          <Link href={"/"} className='text-white font-medium'> <Youtube/> </Link>
          <Link href={"/"} className='text-white font-medium'> <Facebook/> </Link>
      </div>
      <div className='flex items-center justify-center gap-2 w-full mt-1'>
          <span className='text-white border-r-2 border-white/50 pr-2'>© 2023 Toydacity</span>
          <span className='text-white border-r-2 border-white/50 pr-2'>Terms of use</span>
          <span className='text-white'>Privacy policy</span>
      </div>
    </div>
  )
}

export default Footer
