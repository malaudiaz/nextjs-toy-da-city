"use client";

import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import BestDeals from "@/components/shared/home/BestDeals";
import HeroSection from "@/components/shared/home/HeroSection";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <div className="mt-20"></div>
    <BestDeals/>
      {/* <BannerCarousel /> */}
      {/* <ProductHome /> */}
    </>
  );
}
