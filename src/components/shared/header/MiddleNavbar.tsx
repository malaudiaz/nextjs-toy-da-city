import Image from "next/image";
import React from "react";
import Search from "../Search";
import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const MiddleNavbar = () => {
  return (
    <div className="bg-[#3D5D3C] w-full">
      <div className="mx-auto max-w-7xl flex flex-col py-3 px-3">
        <div className="md:hidden">
        <Search />
        <div className="flex items-center justify-between gap-2 pt-2 px-1">
          <Link href={"/"} className="text-white font-medium">
            Post Toy
          </Link>
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignUpButton mode="modal">
                <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
                  ▸ Create your account
                </span>
              </SignUpButton>
              <SignInButton mode="modal">
                <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
                  ▸ Login
                </span>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        </div>
        <div className="hidden md:flex items-center justify-center gap-8">
          <Link href={"/"} className="text-lg text-white border-r border-white/30 pr-2">Categories</Link>
          <Link href={"/"} className="text-lg text-white border-r border-white/30 pr-2">Recommend age</Link>
          <Link href={"/"} className="text-lg text-white">By Location</Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleNavbar;

{
  /* <div className="bg-[#3D5D3C] w-full">
<div className="mx-auto max-w-7xl flex justify-between items-center py-3">
  <div className="flex items-center gap-2 shrink-0">
    <Image
      src="/Logo2.png"
      alt="TOY DACITY logo"
      width={245}
      height={48}
    />
  </div>
  <Search />
  <div className="flex items-center gap-3 shrink-0">
    <Link href={"/"}>
      <ShoppingCart className="text-white" />
    </Link>
    <Link href={"/"}>
      <Heart className="text-white" />
    </Link>

    <Link href={"/"}>
      <User className="text-white" />
    </Link>

    <div className="flex flex-col gap-1">
      <SignedOut>
        <SignUpButton mode="modal">
          <span className="text-sm hidden sm:inline cursor-pointer">
            ▸ Create your account
          </span>
        </SignUpButton>
        <SignInButton mode="modal">
          <span className="text-sm hidden sm:inline cursor-pointer">
            ▸ Login
          </span>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
</div>
</div> */
}
