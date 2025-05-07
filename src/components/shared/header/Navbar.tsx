import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MenuIcon, ShoppingCart } from "lucide-react";
import Search from "../Search";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <header className="bg-[#F2CC8F] w-full pt-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src="/Logo.png"
              alt="TOY DACITY logo"
              width={160}
              height={32}
              className=""
            />
          </div>

          {/* Search and Navigation */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="mb-1">
              <Search />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button className="test2 ">
              Publish a Toy
            </Button>
            <div className="flex flex-col gap-1">
              <SignedOut>
                <SignInButton mode="modal">
                  <span className="hidden sm:inline cursor-pointer">
                    Entrar
                  </span>
                </SignInButton>
                <SignUpButton mode="modal">
                  <span className="hidden sm:inline cursor-pointer">
                    Registrarse
                  </span>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <Link href="/cart" className="p-1 hover:bg-greeen-400 rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
        <BannerNavbar />
    </header>
  );
};

export default Navbar;

const BannerNavbar = () => {
  return (
    <div className="test2 text-white w-full h-12 flex items-center justify-center gap-3 shrink-0">
      <nav className="flex gap-x-4 items-center justify-center">
        <Link href="/home" className="text-lg font-medium hover:underline  border-r-[2px] pr-3">
          Categorias
        </Link>
        <Link href="/home" className="text-lg font-medium hover:underline border-r-[2px] pr-3">
          Edades Recomendadas
        </Link>
        <Link href="/home" className="text-lg font-medium hover:underline">
          Por Ubicación
        </Link>
      </nav>
    </div>
  );
};
