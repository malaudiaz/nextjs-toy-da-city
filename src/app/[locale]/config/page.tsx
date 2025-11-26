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
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { redirect, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocale } from "next-intl"; // ✅

const ConfigurationsPage = () => {
  const locale = useLocale(); // ✅ Siempre actualizado
  const t = useTranslations("config");

  const links = [
    {
      title: t("Toys"),
      url: `/${locale}/config/mytoys`,
      icon: <ToyBrick size={24} />,
    },
    {
      title: t("Purchases"),
      url: `/${locale}/config/purchases`,
      icon: <ShoppingBag size={24} />,
    },
    {
      title: t("Sales"),
      url: `/${locale}/config/sales`,
      icon: <Coins size={24} />,
    },
    {
      title: t("Swap"),
      url: `/${locale}/config/swap`,
      icon: <Repeat size={24} />,
    },
    {
      title: t("Free"),
      url: `/${locale}/config/free`,
      icon: <Gift size={24} />,
    },
    {
      title: t("Favorites"),
      url: `/${locale}/config/favorites`,
      icon: <Heart size={24} />,
    },
    {
      title: "Messages",
      url: `/${locale}/config/messages`,
      icon: <MessageCircle size={24} />,
    },
    {
      title: t("YourReputation"),
      url: `/${locale}/config/reputation`,
      icon: <Star size={24} />,
    },
  ];
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const pathname = usePathname();
  //const language = pathname.split("/")[1];

  // En desktop, redirigir a la página de juguetes si estamos en la ruta base de config
  if (!isMobile && pathname === `/${locale}/config`) {
    redirect(`/${locale}/config/mytoys`);
  }

  // En móvil, mostrar la página de menú solo si estamos en la ruta base de config
  if (isMobile && pathname !== `/${locale}/config`) {
    redirect(`/${locale}/config`);
  }

  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      {/* Sección superior */}
      <div className="bg-[#F0F5F0] border-b border-[#e0e5e0]">
        <div className="px-4 md:px-10 py-2 pt-5 mx-auto max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-lg md:text-xl font-semibold">{t("activity")}</h1>
        </div>
      </div>

      {/* Lista de enlaces - Columna simple */}
      <div className="mx-auto max-w-6xl pb-10">
        <div className="flex flex-col space-y-1 md:space-y-2 px-4 md:px-6">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="flex items-center justify-between p-4 md:p-5 rounded-lg text-gray-800 font-medium hover:bg-[#f8f6e9] hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#e0e5e0]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 bg-[#f0f5f0] rounded-full">
                  {link.icon}
                </span>
                <span className="text-base md:text-lg">{link.title}</span>
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
