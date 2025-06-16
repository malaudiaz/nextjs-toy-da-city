"use client";

import React from "react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { slides } from "@/lib/data/data";
import { Button } from "@/components/ui/button";

export function CarouselToy() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Configurar el evento de cambio para actualizar el índice actual
  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Funciones para navegar
  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  const currentSlide = slides[current];

  return (
    <div className="w-full h-full relative">
      {/* Botón Anterior - Solo desktop */}
      <Button
        onClick={handlePrevious}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Contenedor principal - Flex row en todos los tamaños */}
      <div className="w-full h-full flex flex-row items-center justify-center px-4 md:px-16 gap-4">
        {/* Texto - Tamaño ajustado para móvil */}
        <div className="text-left w-1/3 md:w-auto mr-4 flex flex-col justify-center h-full">
          <div className="space-y-1 md:space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {currentSlide.title}
            </h2>
            <h1 className="text-3xl md:text-6xl font-black leading-tight text-gray-900">
              {currentSlide.subtitle}
            </h1>
            <p className="text-xl md:text-3xl font-black text-[#3D5D3C] mt-2 md:mt-4">
              {currentSlide.tagline}
            </p>
          </div>
        </div>

        {/* Carousel - Más grande en móvil */}
        <Carousel
          setApi={setApi}
          className="w-2/3 md:w-auto max-w-full md:max-w-xs"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={`${slide.subtitle}`}
                    width={600} // Aumentado para móvil
                    height={400} // Aumentado para móvil
                    className=" w-full h-[202px] md:h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Botón Siguiente - Solo desktop */}
      <Button
        onClick={handleNext}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-[#4D7A5F] text-white rounded-full items-center justify-center hover:bg-[#3D6A4F] focus:outline-none"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicadores de paginación */}
      <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: slides.length }).map((_, index) => (
          <Button
            key={index}
            className={`w-3 h-3 rounded-full p-0 min-w-0 ${
              current === index ? "bg-[#4D7A5F]" : "bg-gray-300"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
