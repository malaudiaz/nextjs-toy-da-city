"use client";

import React from "react";
import Search from "../Search";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

interface MiddleNavbarProps {
  locale: string; // ← Asegúrate que acepte string
}

const MiddleNavbar = ({ locale }: MiddleNavbarProps) => {
  const t = useTranslations("navbar");
  return (
    <div className="bg-[#3D5D3C] w-full">
      <div className="mx-auto max-w-7xl flex flex-col py-3 px-3">
        <div className="md:hidden">
        <Search />
        <div className="flex items-center justify-between gap-2 pt-2 px-1">
          <Link href={"/en/post"} className="text-white font-medium">
            {t("Post")}
          </Link>
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignUpButton mode="modal" forceRedirectUrl={`/${locale}/auth-callback?from=registration`}>
                <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
                  ▸ {t("Create your account")}
                </span>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl={`/${locale}/auth-callback?from=signin`}>
                <span className="text-sm text-white sm:inline cursor-pointer hover:underline">
                  ▸ {t("Login")}
                </span>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        </div>
        <div className="hidden h-6 md:flex items-center justify-center gap-8">
          {/* <Link href={"/"} className="text-lg text-white border-r border-white/30 pr-2">Categories</Link>
          <Link href={"/"} className="text-lg text-white border-r border-white/30 pr-2">Recommend age</Link>
          <Link href={"/"} className="text-lg text-white">By Location</Link> */}
        </div>
      </div>
    </div>
  );
};

export default MiddleNavbar;


