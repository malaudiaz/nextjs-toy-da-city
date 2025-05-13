import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import DiscountBadge from "../DiscountBadge";

const ShopNowCard = () => {
  return (
<div className="bg-[#141E2B] w-[424px] h-[248px] rounded-sm p-6 flex relative overflow-hidden">
  {/* Contenedor de texto (centrado verticalmente) */}
  <div className="flex flex-col justify-center h-full z-10 w-[60%] px-4 space-y-2">
    <span className="text-[#F4A261] text-sm font-medium leading-tight">1963 VW BUS DE LUX VOLKSWAGEN BUS</span>
    <p className="text-gray-300 text-lg mt-1 mb-3">Scale Model</p>
    <Button className="bg-[#E07A5F] hover:bg-[#d86b4f] text-white w-[156px] h-[44px] rounded-none">
      Shop Now <ArrowRight className="w-5 h-5" />
    </Button>
  </div>

  {/* Contenedor de imagen (posicionamiento exacto) */}
  <div className="">
    <div className="absolute top-7 right-6 bg-[#F6B27B] h-[30px] w-[95px] text-center text-black text-sm font-bold px-2 py-1 z-10">
      <h3>{"25%OFF"}</h3>
    </div>
    <Image
      src="/image 5.png"
      alt="VW Bus"
      width={312}
      height={312}
      className="object-contain absolute right-0 bottom-0 w-[55%]"
    />
  </div>
</div>
  );
};

export default ShopNowCard;
