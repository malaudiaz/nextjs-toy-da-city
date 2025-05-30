import {
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  LucideMenu,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SelectLanguage from "./SelectLanguage";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Search from "../Search";
import {
  SignedOut,
  SignUpButton,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

const TopNavbar = () => {
  return (
    <header className="bg-[#FAF1DE] w-full p-4">
      <div className="mx-auto max-w-7xl">
        {/* Versión móvil */}
        <div className="flex md:hidden items-center justify-between">
         <div className="flex items-center gap-1">
         <Button className="bg-[#FAF1DE] hover:bg-[#FAF1DE] shadow-none p-2">
            <LucideMenu className="text-black size-5" />
          </Button>
          <Image src="/Logo.png" alt="logo" width={140} height={28} />
         </div>
          <SelectLanguage />
        </div>

        {/* Versión desktop */}
        <div className="hidden md:flex items-center justify-between gap-8">
          <Image src="/Logo.png" alt="logo" width={160} height={32} />

          <div className="flex-1 max-w-xl">
            <Search />
          </div>

          <div className="flex items-center gap-6">
            <Button className="whitespace-nowrap bg-[#4c754b] text-white px-4">
              <Link href={"/en/post"}>Post a Toy</Link>
            </Button>

            <div className="flex flex-col items-start gap-1">
              <SignedOut>
                <SignUpButton mode="modal">
                  <span className="text-sm text-black sm:inline cursor-pointer hover:underline">
                    ▸ Create your account
                  </span>
                </SignUpButton>
                <SignInButton mode="modal">
                  <span className="text-sm text-black sm:inline cursor-pointer hover:underline">
                    ▸ Login
                  </span>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>

              
            </div>
            <Link href="/" className="text-black hover:text-gray-700">
                <ShoppingCart className="size-5" />
              </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

{
  /* <header className="bg-[#3D5D3C] w-full pt-2 border-b border-white/50">
    <div className="mx-auto max-w-7xl py-3 flex justify-between items-center border-white">
      <h3 className="text-white">
        Welcome to Toydacity: The Sustainable Toy Marketplace
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p className="text-white text-sm">Follow us:</p>
        <div className="flex gap-x-1">
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Twitter />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Facebook />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Youtube />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white border-r border-white/30 pr-4">
            <Instagram />
          </Link>
          <SelectLanguage/>
        </div>
      </div>
    </div>
</header> */
}

//  <SignedOut>
// <SignUpButton mode="modal">
//   <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
//     ▸ Create your account
//   </span>
// </SignUpButton>
// <SignInButton mode="modal">
//   <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
//     ▸ Login
//   </span>
// </SignInButton>
// </SignedOut>
// <SignedIn>
// <UserButton />
// </SignedIn>
