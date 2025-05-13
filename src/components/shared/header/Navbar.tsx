import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  Facebook,
  Instagram,
  MenuIcon,
  ShoppingCart,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import Search from "../Search";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import TopNavbar from "./TopNavbar";
import MiddleNavbar from "./MiddleNavbar";
import BottomNavbar from "./BottomNavbar";

const Navbar = () => {
  return (
    // <header className="bg-[#F2CC8F] w-full pt-2">
    //   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    //     <div className="flex items-center justify-between gap-4 py-2">
    //       {/* Logo and Title */}
    //       <div className="flex items-center gap-2 shrink-0">
    //         <Image
    //           src="/Logo.png"
    //           alt="TOY DACITY logo"
    //           width={160}
    //           height={32}
    //           className=""
    //         />
    //       </div>

    //       {/* Search and Navigation */}
    //       <div className="flex-1 max-w-2xl mx-4">
    //         <div className="mb-1">
    //           <Search />
    //         </div>
    //       </div>

    //       {/* User Actions */}
    //       <div className="flex items-center gap-3 shrink-0">
    //         <Button className="test2 ">
    //           Publish a Toy
    //         </Button>
    //         <div className="flex flex-col gap-1">
    //           <SignedOut>
    //           <SignUpButton mode="modal">
    //               <span className="text-sm hidden sm:inline cursor-pointer">
    //               ▸ Create your account
    //               </span>
    //             </SignUpButton>
    //             <SignInButton mode="modal">
    //               <span className="text-sm hidden sm:inline cursor-pointer">
    //               ▸ Login
    //               </span>
    //             </SignInButton>

    //           </SignedOut>
    //           <SignedIn>
    //             <UserButton />
    //           </SignedIn>
    //         </div>
    //         <Link href="/cart" className="p-1 hover:bg-greeen-400 rounded-full">
    //           <ShoppingCart className="size-10" />
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    //     <BannerNavbar />
    // </header>
    <>
    <TopNavbar />
    <MiddleNavbar />
    <BottomNavbar />
    </>
  );
};

export default Navbar;
