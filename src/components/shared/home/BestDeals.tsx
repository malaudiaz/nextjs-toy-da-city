import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductCard from "../ProductCard";
import PrincipalCard from "../PrincipalCard";
import { Card } from "@/lib/data/data";

const BestDeals = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-auto h-[792px] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-bold text-gray-900">Best Deals</h2>
          <Link
            href="/"
            className="group flex items-center gap-1 transition-transform duration-300"
          >
            Browse All Product
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-6">
          {/* Principal Card (ocupa 2 columnas y 5 filas) */}
          <div className="row-span-5 col-span-2">
            <PrincipalCard />
          </div>
          {Card.map((item, index) => (
            <ProductCard
              key={index}
              {...item}
              className="h-full" // Asegura que todas ocupen la misma altura
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
