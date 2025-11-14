import ToyGrid from "@/components/config/ToyGrid";
import React from "react";
import { getOwnToys } from "@/lib/actions/toysAction";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";


const ToysPage = async () => {
  const toys = await getOwnToys();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <TitleBreakcrumbs translationScope="configurations.toys" />
        <ToyGrid toys={toys} />
      </div>
    </div>
  );
};

export default ToysPage;
