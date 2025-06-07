
import React from "react";
import Search from "../Search";
import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const MiddleNavbar = () => {
  return (
    <div className="bg-[#3D5D3C] w-full">
      <div className="mx-auto max-w-7xl flex flex-col py-3 px-3">
        <div className="md:hidden">
        <Search />
        <div className="flex items-center justify-between gap-2 pt-2 px-1">
          <Link href={"/en/post"} className="text-white font-medium">
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


