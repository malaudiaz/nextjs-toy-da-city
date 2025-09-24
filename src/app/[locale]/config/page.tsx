"use client";
import {
  Coins,
  Gift,
  Heart,
  MessageCircle,
  Repeat,
  ShoppingBag,
  Star,
  ToyBrick,
} from "lucide-react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { redirect, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ConfigurationsPage = () => {
  const t = useTranslations("config");
  const { user } = useUser();

  console.log(user);

  const links = [
    { name: "Sales", href: "/config/sales", icon: <Coins /> },
    { name: "Toys", href: "/config/toys", icon: <ToyBrick /> },
    { name: "Purchases", href: "/config/purchases", icon: <ShoppingBag /> },
    { name: "Swap", href: "/config/swap", icon: <Repeat /> },
    { name: "Free", href: "/config/free", icon: <Gift /> },
    { name: "Favorites", href: "/config/favorites", icon: <Heart /> },
    { name: "Chat",href: "/config/chat",icon: <MessageCircle />,},
    { name: "YourReputation", href: "/config/reputation", icon: <Star /> },
  ];
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const pathname = usePathname();
  const language = pathname.split("/")[1];

  if (!isMobile) {
    redirect(`/${language}/config/toys`);
  }

  return (
    <div className="w-full h-full bg-[#fbfaf4] md:hidden">
      {/* Sección superior */}
      <div className="bg-[#F0F5F0] border-b border-[#e0e5e0]">
        <div className="px-4 md:px-10 py-2 pt-5 mx-auto max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-lg md:text-xl font-semibold">Your Profile</h1>
        </div>
      </div>

      {/* Perfil */}
      <div className="px-4 md:px-6 py-4 md:py-6 flex flex-row gap-4 justify-between mx-auto max-w-6xl border-b border-[#f0f0f0]">
        <Link
          href={"#"}
          className="flex items-center p-2 rounded-full transition-colors"
        >
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </div>

      {/* Título actividad */}
      <div className="bg-[#F0F5F0] border-y border-[#e0e5e0]">
        <div className="px-4 md:px-10 py-3 md:py-4 mx-auto max-w-6xl">
          <h1 className="text-lg md:text-xl font-semibold">Your Activity</h1>
        </div>
      </div>

      {/* Lista de enlaces - Columna simple */}
      <div className="mx-auto max-w-6xl pb-10">
        <div className="flex flex-col space-y-1 md:space-y-2 px-4 md:px-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center justify-between p-4 md:p-5 rounded-lg text-gray-800 font-medium hover:bg-[#f8f6e9] hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#e0e5e0]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 bg-[#f0f5f0] rounded-full">
                  {link.icon}
                </span>
                <span className="text-base md:text-lg">{t(link.name)}</span>
              </div>
              <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationsPage;
