import { getOwnToys } from "@/lib/actions/toysAction";
import React from "react";
import ToyCard from "./ToyCard";

const ToyGrid = async () => {
  const toys = await getOwnToys();
  return (
    <div className="">
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
