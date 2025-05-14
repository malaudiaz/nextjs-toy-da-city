"use client";

import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import BestDeals from "@/components/shared/home/BestDeals";
import CategoryCarousel from "@/components/shared/home/CategoryCarousel";
import FeaturesProduct from "@/components/shared/home/FeaturesProduct";

import HeroSection from "@/components/shared/home/HeroSection";
import PromoWidthBanner from "@/components/shared/home/PromoWidthBanner";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <div className="mt-20"></div>
    <BestDeals/>
    <CategoryCarousel/>
    <div className="mt-15"></div>
    <FeaturesProduct/>
    <PromoWidthBanner/>
      {/* <BannerCarousel /> */}
      {/* <ProductHome /> */}
    </>
  );
}
