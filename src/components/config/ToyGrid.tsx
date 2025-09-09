import { getOwnToys } from "@/lib/actions/toysAction";
import React from "react";
import ToyCard from "./ToyCard";

const ToyGrid = async () => {
  const toys = await getOwnToys();
  console.log(toys);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {toys.map((toy) => (
        <ToyCard key={toy.id} toy={toy} />
      ))}
      {toys.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No tienes juguetes en venta aún.
          </p>
        </div>
      )}
    </div>
  );
};

export default ToyGrid;
