"use client"
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type CarouselCard = {
    subtitle: string,
    title: string,
    description:string,
    buttonText:string,
    image:string,
    price:string
}
const CarouselItems: CarouselCard[] = [
    {
      subtitle: "Welcome to",
      title: "Toydacity",
      description: "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.",
      buttonText: "Explore",
      image: "/Casita.png",
      price: "299",
    },
    {
      subtitle: "Discover",
      title: "Fun Toys",
      description: "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.",
      buttonText: "Explore",
      image: "/Casita.png",
      price: "299",
    },
    {
      subtitle: "Explore",
      title: "Creativity",
      description: "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.",
      buttonText: "Explore",
      image: "/Casita.png",
      price: "299",
    },
  ]

const CarouselCard = () => {
    const [activeIndex, setActiveIndex] = useState(0)

 
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % CarouselItems.length)
      }, 5000)
  
      return () => clearInterval(interval)
    }, [])
  
    const handleDotClick = (index: number) => {
      setActiveIndex(index)
    }

  return (
    <div className="bg-[#E8ECF1] w-full h-full rounded-sm p-6 flex relative">
  {/* Contenedor de texto (izquierda) */}
  <div className="w-1/2 flex flex-col pr-6 relative">
    <div className="flex flex-col h-full px-6 place-content-center space-y-3">
      <span className="text-[#4C754B] font-medium"> {CarouselItems[activeIndex].subtitle}</span>
      <h1 className="text-5xl font-bold text-gray-900">{CarouselItems[activeIndex].title}</h1>
      <p className="text-[#293C55] line-clamp-3 text-md">{CarouselItems[activeIndex].description}</p>
      <div>
      <Button className="bg-[#E07A5F] hover:bg-[#bb664f] text-white w-1/2 py-6 flex items-center gap-2">
        {CarouselItems[activeIndex].buttonText}
        <ArrowRight className="w-5 h-5" />
      </Button>

      {/* Navegación por puntos */}
    </div> 
    <div className="absolute bottom-6 left-6 flex gap-2">
        {CarouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === activeIndex ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  </div>

  {/* Contenedor de imagen (derecha) */}
  <div className="w-1/2 relative">
    <Image 
      src={CarouselItems[activeIndex].image} 
      alt="banner" 
      width={368} 
      height={408} 
      className="absolute right-0 h-full w-auto object-contain"
    />
    <div className='absolute top-0 right-0 rounded-full w-[100px] h-[100px] bg-[#5B8C5A] z-10 flex justify-center items-center'>
        <span className='text-white text-2xl'>€ {CarouselItems[activeIndex].price}</span>
    </div>
  </div>
</div>
  )
}

export default CarouselCard


