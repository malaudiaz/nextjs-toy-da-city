import React from "react";
import PromoCardLarge from "../promoCards/PromoCardLarge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "../ProductCard";
import FeaturedCard from "./FeaturedCard";

const FeaturesProduct = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-7xl h-[792px] px-4 ">
        <div className="flex gap-4 justify-between py-4  ">
          <PromoCardLarge />
          <div className="w-full flex flex-col h-full gap-4">
            <div className="flex  justify-between items-center">
              <h1 className=" font-bold">Featured Products</h1>
              <nav className="flex items-center gap-1 text-xs">
                <Button variant="ghost" className="rounded-none">
                  All Products
                </Button>
                <Button variant="ghost" className="rounded-none">
                  SmartPhone
                </Button>
                <Button variant="ghost" className="rounded-none">
                  Laptop
                </Button>
                <Button variant="ghost" className="rounded-none">
                  HeadPhone
                </Button>
                <Button variant="ghost" className="rounded-none">
                  Tv
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-none flex items-center gap-1"
                >
                  Browse All Product
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </nav>
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-4 flex-grow h-[650px]">
             {
                Array.from({ length: 8 }, (_, index) => (
                    <FeaturedCard key={index} />
                ))
             }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesProduct;
