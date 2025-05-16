import React from 'react'
import { CarouselToy } from './CarouselToy'


const BannerCarousel = () => {
  return (
    <div className="w-full h-[253px] bg-[#F8F6E9] hidden md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <CarouselToy />
      </div>
    </div>
  )
}

export default BannerCarousel
