"use client";
import { LucideMenu, Settings, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";

const SearchLinks = [
  { name: "Toys", href: "#" },
  { name: "Categories", href: "#" },
  { name: "Brands", href: "#" },
  { name: "Configurations", href: "/en/config" },
];

const TopNavbar = () => {
  const t = useTranslations("navbar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#FAF1DE] w-full p-4 relative">
      <div className="mx-auto max-w-7xl">
        {/* Versión móvil */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center ">
            <Button
              className="bg-[#FAF1DE] hover:bg-[#cbc9b9] shadow-none p-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="text-black size-5" />
              ) : (
                <LucideMenu className="text-black size-5" />
              )}
            </Button>
            <Link href={"/"}>
              <Image
                src="/Logo.png"
                alt="logo"
                width={140}
                height={28}
                className="h-[50px] flex-shrink-0"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative inline-block group">
              <ShoppingCart className="size-6 transition-transform group-hover:scale-110" />
              {items.length > 0 && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-[#4c754b] text-white text-xs rounded-full transform transition-all group-hover:scale-125">
                  {items.length}
                </div>
              )}
            </div>
            <SelectLanguage />
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAF1DE] border-t border-gray-200 shadow-lg z-50">
            <div className="p-4 space-y-4">
              {SearchLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="w-full flex flex-col"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <Button className="w-full bg-[#4c754b] hover:bg-[#558d54] text-white px-4 py-2">
                <Link href={"/en/post"} className="w-full">
                  {t("Post")}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Versión desktop */}
        <div className="hidden md:flex items-center justify-between gap-8">
          <Link href={"/"}>
            <Image src="/Logo.png" alt="logo" width={160} height={32} />
          </Link>

          <div className="flex-1 max-w-xl">
            <Search />
          </div>

          <div className="flex items-center gap-6">
            <Button className="whitespace-nowrap bg-[#4c754b] hover:bg-[#558d54] text-white px-4">
              <Link href={"/en/post"}>{t("Post")}</Link>
            </Button>

            <div className="flex flex-col items-start gap-1">
              <SignedOut>
                <SignUpButton mode="modal">
                  <span className="text-sm text-black sm:inline cursor-pointer hover:underline">
                    ▸ {t("Create your account")}
                  </span>
                </SignUpButton>
                <SignInButton mode="modal">
                  <span className="text-sm text-black sm:inline cursor-pointer hover:underline">
                    ▸ {t("Login")}
                  </span>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <Link href="/cart" className="text-black hover:text-gray-700">
              <div className="relative inline-block group">
                <ShoppingCart className="size-6 transition-transform group-hover:scale-110" />
                {items.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-[#4c754b] text-white text-xs rounded-full transform transition-all group-hover:scale-125">
                    {items.length}
                  </div>
                )}
              </div>
            </Link>
            <Link href="/en/config" className="text-black hover:text-gray-700">
              <Settings className="size-6" />
            </Link>
            <SelectLanguage />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
