import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import { getSales } from "@/lib/actions/toysAction";
import React from "react";


const SalesPage = async () => {
  const sales = await getSales();
  console.log(sales);
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <SaleInfo sales={sales} />
    </div>
  );
};

export default SalesPage;
