import ToyGrid from "@/components/config/ToyGrid";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import React from "react";
import { getOwnToys } from "@/lib/actions/toysAction";

const ToysPage = async () => {
  const toys = await getOwnToys();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs />
        <ToyGrid toys={toys} />
      </div>
    </div>
  );
};

export default ToysPage;
