import SaleInfo from "@/components/shared/profile/SaleInfo";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import { getSales } from "@/lib/actions/toysAction";
import React from "react";

const SalesPage = async () => {
  const sales = await getSales();
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <TitleBreakcrumbs translationScope="sales" />
      </div>
      <SaleInfo sales={sales} />
    </div>
  );
};

export default SalesPage;
