"use client";

import type * as React from "react";
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

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const { user } = useUser();
  const t = useTranslations("config");
  const navigationItems = [
    {
      title: t("Toys"),
      url: "/config/toys",
      icon: ToyBrick,
    },
    {
      title: t("Purchases"),
      url: "/config/purchases",
      icon: ShoppingBag,
    },
    {
      title: t("Sales"),
      url: `/config/sales`,
      icon: Coins,
    },
    {
      title: t("Swap"),
      url: "/config/swap",
      icon: Repeat,
    },
    {
      title: t("Free"),
      url: "/config/free",
      icon: Gift,
    },
    {
      title: t("Favorites"),
      url: "/config/favorites",
      icon: Heart,
    },
    {
      title: "Messages",
      url: "/config/messages",
      icon: MessageCircle,
    },
    {
      title: t("YourReputation"),
      url: "/config/reputation",
      icon: Star,
    },
  ];

  return (
    <Sidebar {...props} >
      <SidebarHeader>
        <div className="px-4 py-4 flex flex-col items-center justify-between border-b border-[#f0f0f0] bg-white">
          <div className="flex items-center gap-4">
            {/* Contenedor de imagen redonda */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0">
              <Image
                src={user?.imageUrl || "/no-image.png"}
                alt="avatar"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Texto del nombre */}
            <p className="text-xl  font-poppins">{user?.fullName}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const itemUrl = `/${language}${item.url}`;
                const isActive = pathname === itemUrl;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-12 px-4 text-base hover:shadow-lg ${
                        isActive
                          ? "bg-[#4C754B] hover:bg-[#4C754B] text-white hover:text-white"
                          : "hover:bg-[#4C754B] hover:text-white"
                      }`}
                    >
                      <Link
                        href={itemUrl}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
