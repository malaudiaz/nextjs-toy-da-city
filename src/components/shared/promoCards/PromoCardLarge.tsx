import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const PromoCardLarge = () => {
  return (
    <div className="flex flex-col bg-[#F8C196] h-full">
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-10 h-1/3">
        <span>COMPUTER ACCESSORIES</span>
        <h2 className="font-bold text-3xl">32% Discount</h2>
        <span>For all electronics products</span>


        <div className="flex items-center gap-2 w-full justify-center whitespace-nowrap">
          <span className="text-xs">Offers end in:</span>
          <Button className="rounded-none bg-white text-black hover:bg-white text-xs px-2 py-1">
            ENDS OF CHRISTMAS
          </Button>
        </div>

        <Button className="bg-[#E07A5F] hover:bg-[#bb664f] text-white w-3/4 py-6">
          SHOP NOW
        </Button>
      </div>
      <div>
        <Image
          src={"/Image.jpg"}
          alt="product"
          width={312}
          height={426}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default PromoCardLarge;
