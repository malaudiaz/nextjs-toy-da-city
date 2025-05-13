import Image from "next/image";
import React from "react";
import Search from "../Search";
import Link from "next/link";
import { Heart, ShoppingCart, User } from "lucide-react";

const MiddleNavbar = () => {
  return (
    <div className="bg-[#3D5D3C] w-full">
      <div className="mx-auto max-w-7xl flex justify-between items-center py-3">
        <div className="flex items-center gap-2 shrink-0">
          <Image
            src="/Logo2.png"
            alt="TOY DACITY logo"
            width={245}
            height={48}
          />
        </div>
        <Search />
        <div className="flex items-center gap-3 shrink-0">
          <Link href={"/"}>
            <ShoppingCart className="text-white" />
          </Link>
          <Link href={"/"}>
            <Heart className="text-white" />
          </Link>
          <Link href={"/"}>
            <User className="text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleNavbar;
