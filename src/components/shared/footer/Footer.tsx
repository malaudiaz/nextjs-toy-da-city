import { Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <div className="w-full h-full mt-auto bg-[#24272A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  py-10">
        <div className="grid grid-cols-2 gap-4 place-items-center">
          <div className="flex flex-col space-y-1">
            <Image src={"/Logo2.png"} alt={"Toy"} width={118} height={23} />
            <Link href={"/mission"} className="text-white font-medium">
              {t("Footer1")}
            </Link>
            <Link href={"/contact"} className="text-white font-medium">
              {t("Footer2")}
            </Link>
          </div>
          <div className="flex flex-col space-y-1">
            <Link href={"/"} className="text-white font-medium">
              ▸ {t("Footer3")}
            </Link>
            <Link href={"/"} className="text-white font-medium">
              ▸ {t("Footer4")}
            </Link>
            <Link href={"/"} className="text-white font-medium">
              ▸ {t("Footer5")}
            </Link>
          </div>
        </div>
      </div>
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
      </div>
      <span className="text-white border-r-2 border-white/50 flex justify-center mt-1">
        © 2025 Toydacity
      </span>
    </div>
  );
};

export default Footer;
