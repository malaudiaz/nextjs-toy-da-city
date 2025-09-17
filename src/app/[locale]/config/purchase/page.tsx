import React from "react";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import PurchasesInfo from "@/components/shared/profile/PurchasesInfo";
import { getOrder } from "@/lib/actions/orderActions";

export type OrderStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELED"
  | "TRANSFERRED"
  | "REEMBURSED"

type Props = {
  searchParams: { status?: OrderStatus };
};

const ComprasPage = async ({ searchParams }: Props) => {
  const filter = await searchParams;
  const purchases = await getOrder(filter.status)
  return (
    <div>
      <div className="px-5 py-3 md:hidden ">
        <Breadcrumbs />
      </div>
      <PurchasesInfo orders={purchases}  />
    </div>
  );
};

export default ComprasPage;
