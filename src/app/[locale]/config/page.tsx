"use client";
import { Coins, Gift, Heart, Repeat, ShoppingBag, Star } from "lucide-react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const ConfigurationsPage = () => {
  const t = useTranslations("config");
  const { user } = useUser();

  const links = [
    { name: "Sales", href: "/config/ventas", icon: <Coins /> },
    { name: "Purchases", href: "/config/compras", icon: <ShoppingBag /> },
    { name: "Trades", href: "/config/intercambios", icon: <Repeat /> },
    { name: "Gifts", href: "/config/regalos", icon: <Gift /> },
    { name: "Favorites", href: "/config/favoritos", icon: <Heart /> },
    { name: "YourReputation", href: "#", icon: <Star /> },
  ];

  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <Breadcrumbs />
        <h1 className="text-lg font-semibold">Your Profile</h1>
      </div>
      <div className="px-6 py-4 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-sm">
            <Image
              src={user?.imageUrl || "/no-image.png"}
              alt="avatar"
              width={76}
              height={76}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-poppins">{user?.fullName}</p>
          </div>
        </div>

        <Link href={"#"} className="flex items-center">
          <ArrowRight />
        </Link>
      </div>

      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-semibold">Your Activity</h1>
      </div>

      {/* probar con space-y-2 */}
      <div className="">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center justify-between w-full px-10 py-4 rounded-lg text-gray-800 font-medium  hover:bg-[#f8f6e9] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{link.icon}</span>
              <span>{t(link.name)}</span>
            </div>
            <ArrowRight className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationsPage;
