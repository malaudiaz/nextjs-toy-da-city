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
  searchParams: Promise<{ status?: OrderStatus }>;
};

const ComprasPage = async ({ searchParams }: Props) => {
  const filter = await searchParams;
  const purchases = await getOrder(filter.status)
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs  />
      </div>
      <PurchasesInfo orders={purchases}  />
    </div>
  );
};

export default ComprasPage;
