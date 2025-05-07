"use client";
import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import ProductHome from "@/components/shared/home/ProductHome";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <BannerCarousel/>
    <ProductHome/>
    </>
  );
}


      {/* <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/protected"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Entrar a página protegida
          </Link>
        </div>
      </main> */}