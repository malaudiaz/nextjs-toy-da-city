"use client";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Coins, Gift, Heart, Repeat, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const links = [
    { name: "Ventas", href: "#" , icon: <Coins/>},
    { name: "Compras", href: "#", icon: <ShoppingBag/> },
    { name: "Intercambios", href: "#" , icon: <Repeat/> },
    { name: "Regalos", href: "#" , icon: <Gift/> },
    { name: "Favoritos", href: "#" , icon: <Heart/> },
    { name: "Ver tu Reputacion", href: "#" , icon: <Star/> },
]


const ProfilePage = () => {
  const { isSignedIn, user } = useUser();
  console.log(user);
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-bold">Tu Perfil</h1>
      </div>
      <div className="px-6 py-4 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-sm">
            <Image
              src={user?.imageUrl || "/tren.png"}
              alt="avatar"
              width={76}
              height={76}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-bold">{user?.fullName}</p>
          </div>
        </div>

        <Link href={"#"} className="flex items-center">
          <ArrowRight />
        </Link>
      </div>

       <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-bold">Tu Actividad</h1>
      </div>

      <div>
        {links.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center justify-between gap-2 px-10 py-4 cursor-pointer">
                <div className="flex items-center gap-2">
                    {link.icon}{link.name}
                </div>
                <ArrowRight className="ml-auto" />
            </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
