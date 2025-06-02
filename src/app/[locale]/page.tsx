"use client";

import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import WelcomeBanner from "@/components/shared/banner/WelcomeBanner";
import BestDeals from "@/components/shared/home/BestDeals";
import CategoryCarousel from "@/components/shared/home/CategoryCarousel";
import FeaturesProduct from "@/components/shared/home/FeaturesProduct";

import HeroSection from "@/components/shared/home/HeroSection";
import PromoWidthBanner from "@/components/shared/home/PromoWidthBanner";
import ProductCard from "@/components/shared/ProductCard";
import Image from "next/image";

export default function Home() {
  return (
    <>
     {/* <WelcomeBanner/> */}
     <BannerCarousel/>
     <div className="mx-auto max-w-7xl grid grid-cols-2 gap-4 mt-5 px-4 pb-6 md:grid-cols-3 md:gap-8 md:px-16 lg:px-8 lg:grid-cols-4">
      <ProductCard description="My little pony vintage g2 magician ponies" image="/image 4.png" price="200" status="New" condition="SALE"/>
      <ProductCard description="My little pony vintage g2 magician ponies" image="/image 4.png" price="200" status="New"/>
      <ProductCard description="My little pony vintage g2 magician ponies" image="/image 4.png" price="200" status="New"/>
      <ProductCard description="My little pony vintage g2 magician ponies" image="/image 4.png" price="200" status="New"/>
     </div>
    </>
  );
}

{
  /* <HeroSection/>
    <div className="mt-20"></div>
    <BestDeals/>
    <CategoryCarousel/>
    <div className="mt-15"></div>
    <FeaturesProduct/>
    <PromoWidthBanner/> */
}
{
  /* <BannerCarousel /> */
}
{
  /* <ProductHome /> */
}
