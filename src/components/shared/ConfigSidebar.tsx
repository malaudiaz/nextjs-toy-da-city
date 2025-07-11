"use client";

import type * as React from "react";
import { Building2, Coins, FileText, Gift, Heart, Home, Repeat, ShoppingBag, Star, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Sales",
    url: `/config/ventas`,
    icon: Coins,
  },
  {
    title: "Purchases",
    url: "/config/compras",
    icon: ShoppingBag,
  },
  {
    title: "Trades",
    url: "/config/intercambios",
    icon: Repeat,
  },
  {
    title: "Gifts",
    url: "/config/regalos",
    icon: Gift,
  },
  {
    title: "Favorites",
    url: "/config/favoritos",
    icon: Heart,
  },
  {
    title: "Your Reputation",
    url: "#",
    icon: Star,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
const pathname = usePathname();
const language = pathname.split("/")[1];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent className="bg-[#F8F6E9]">
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-2">
                  <SidebarMenuButton className="h-12 px-4 text-base hover:shadow-lg">
                    <Link
                      href={`/${language}/${item.url}`}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}