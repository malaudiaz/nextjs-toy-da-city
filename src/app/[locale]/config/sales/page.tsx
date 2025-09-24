import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import { getSales } from "@/lib/actions/toysAction";
import React from "react";


const SalesPage = async () => {
  const sales = await getSales();
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs  />
      </div>
      <SaleInfo sales={sales} />
    </div>
  );
};

export default SalesPage;
