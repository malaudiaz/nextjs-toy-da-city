import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SaleInfo from "@/components/shared/profile/SaleInfo";
import { getSales } from "@/lib/actions/toysAction";
import React from "react";

export type SalesStatus = "available" | "reserved" | "sold" | "canceled";

type Props = {
  searchParams: { status?: SalesStatus };
};

const VentasPage = async ({ searchParams }: Props) => {
  const filter = await searchParams;
  const sales = await getSales(filter.status);
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <SaleInfo sales={sales} />
    </div>
  );
};

export default VentasPage;
