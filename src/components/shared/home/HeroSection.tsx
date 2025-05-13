import React from 'react'
import CarouselCard from './CarouselCard'
import ShopNowCard from './ShopNowCard'
import SimpleShopCard from './SimpleShopCard'

const HeroSection = () => {
  return (
    <div className='w-full h-full'>
      <div className='mx-auto max-w-7xl px-4 h-[584px] flex items-center justify-between gap-4'>
        <div className='w-2/3 h-[520px] '>
        <CarouselCard/>
        </div>
        <div className='w-1/3 h-full flex flex-col gap-3 mt-[64px]'>
            <ShopNowCard/>
            <SimpleShopCard/>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
