"use client"

import React from "react"
import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { slides } from "@/lib/data/data"
import { Button } from "@/components/ui/button"

export function CarouselToy() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)



  // Configurar el evento de cambio para actualizar el índice actual
  React.useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Funciones para navegar
  const handlePrevious = () => {
    api?.scrollPrev()
  }

  const handleNext = () => {
    api?.scrollNext()
  }

  const currentSlide = slides[current]

  return (
    <div className="w-full h-full relative">
    {/* Botón Anterior - Extremo Izquierdo */}
    <Button
      onClick={handlePrevious}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full flex items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>

    <div className="w-full h-full flex items-center justify-center px-16">
      {/* Texto centrado */}
      <div className="text-left mr-4">
        <h2 className="text-2xl font-bold mb-1">{currentSlide.title}</h2>
        <h1 className="text-6xl font-black mb-4">{currentSlide.subtitle}</h1>
        <p className="text-3xl font-medium text-[#F08080]">{currentSlide.tagline}</p>
      </div>

      {/* Carousel restaurado */}
      <Carousel
        setApi={setApi}
        className="w-auto max-w-xs"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="p-1">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={`${slide.subtitle}`}
                  height={239}
                  width={428}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>

    {/* Botón Siguiente - Extremo Derecho */}
    <Button
      onClick={handleNext}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full flex items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
    >
      <ChevronRight className="h-6 w-6" />
    </Button>
  </div>
  )
}



 // <div className="w-full h-full relative">
    //   {/* Botón Anterior - Extremo Izquierdo */}
    //   <button
    //     onClick={handlePrevious}
    //     className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full flex items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
    //   >
    //     <ChevronLeft className="h-6 w-6" />
    //   </button>

    //   <div className="w-full h-full flex items-center px-16">
    //     <div className="flex-1">
    //       <div className="max-w-md">
    //         <h2 className="text-2xl font-bold mb-1">{currentSlide.title}</h2>
    //         <h1 className="text-6xl font-black mb-4">{currentSlide.subtitle}</h1>
    //         <p className="text-3xl font-medium text-[#F08080]">{currentSlide.tagline}</p>
    //       </div>
    //     </div>

    //     <div className="flex-1">
    //       <Carousel
    //         className="w-full h-full"
    //         setApi={setApi}
    //         opts={{
    //           loop: true,
    //         }}
    //       >
    //         <CarouselContent className="h-full">
    //           {slides.map((slide) => (
    //             <CarouselItem key={slide.id} className="h-full">
    //               <div className="p-1 h-full">
    //                 <Card className="h-full border-none shadow-none bg-transparent">
    //                   <CardContent className="flex items-center justify-center p-6 h-full">
    //                     <img
    //                       src={slide.image || "/placeholder.svg"}
    //                       alt={`${slide.subtitle}`}
    //                       className="max-h-[200px] object-contain"
    //                     />
    //                   </CardContent>
    //                 </Card>
    //               </div>
    //             </CarouselItem>
    //           ))}
    //         </CarouselContent>
    //       </Carousel>
    //     </div>
    //   </div>

    //   {/* Botón Siguiente - Extremo Derecho */}
    //   <button
    //     onClick={handleNext}
    //     className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full flex items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
    //   >
    //     <ChevronRight className="h-6 w-6" />
    //   </button>
    // </div>