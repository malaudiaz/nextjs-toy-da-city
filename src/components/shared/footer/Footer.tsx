import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <div className="w-full h-full mt-auto bg-[#24272A] pt-4 pb-4">
      <div className="flex items-center justify-center gap-2 w-full">
        <Link href={"/"} className="text-white font-medium">
          {" "}
          <Facebook />{" "}
        </Link>
        <Link href={"/"} className="text-white font-medium">
          {" "}
          <Instagram />{" "}
        </Link>
        <Link href={"/"} className="text-white font-medium">
          {" "}
          <Youtube />{" "}
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-white mt-1">
        <Link href={"/mission"} className="text-white font-medium">
          {t("Footer1")}
        </Link>
        <span className="sm:inline text-white">|</span>
        <Link href="/terms" className="hover:underline">
          {t("Footer6")}
        </Link>
        <span className="sm:inline text-white">|</span>
        <Link href="/policies" className="hover:underline">
          {t("Footer7")}
        </Link>
        <span className="sm:inline">|</span>
        <Link href="/deletedata" className="hover:underline">
          {t("Footer8")}
        </Link>
        <span className="sm:inline">|</span>
        <Link href={"/contact"} className="text-white font-medium">
          {t("Footer2")}
        </Link>

      </div>
      <span className="text-white border-r-2 border-white/50 flex justify-center mt-1">
          &copy; 2025 &nbsp; <Image src={"/Logo2.png"} alt={"Toy"} width={118} height={23} />
      </span>
    </div>
  );
};

export default Footer;
