import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const PromoWidthBanner = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl bg-[#D5F0D3] h-[424px] flex items-center gap-0">
        {" "}
        {/* gap-0 para eliminar espacio entre columnas */}
        {/* Sección de texto - 60% del ancho */}
        <div className="w-3/5 px-12 py-10 h-full flex flex-col justify-center">
          <div className="px-4 space-y-4 max-w-md">
            <span className="inline-block bg-[#5B8C5A] px-3 py-1 text-sm font-medium">
              SAVE UP TO $200
            </span>
            <h1 className="text-4xl font-bold tracking-tight">MACKBOOK PRO</h1>
            <div className="max-w-xs">
              <p className="line-clamp-2 h-14 overflow-hidden text-ellipsis text-lg leading-7">
                Apple M1 Max Chip 32GB Unified Memory, 1TB SSD Storage
              </p>
            </div>
            <Button className="bg-[#E07A5F] hover:bg-[#bb664f] text-white  py-5 w-[150px]  rounded-md ">
              {" "}
              SHOP NOW <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="w-2/5 h-full relative">
  {/* Círculo de descuento - Centrado y con borde */}
  <div className="absolute top-5 -left-15 rounded-full size-[110px] bg-[#F0BDAF] z-10 border-6 border-white flex items-center justify-center">
    <span className="text-black text-xl font-bold">$200</span>
  </div>
  
  {/* Imagen */}
  <Image
    src="/tienda.png"
    alt="MacBook Pro"
    fill
    className="object-cover object-right" 
    sizes="(max-width: 768px) 100vw, 40vw"
  />
</div>
      </div>
    </div>
  );
};

export default PromoWidthBanner;
