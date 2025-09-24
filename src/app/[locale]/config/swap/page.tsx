import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SwapInfo from "@/components/shared/profile/SwapInfo";
import { getSwaps } from "@/lib/actions/toysAction";

export default async function ExchangesPage() {
  const swaps = await getSwaps()
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-background">
        <div className="px-5 py-3">
          <Breadcrumbs />
        </div>
        <SwapInfo swaps={swaps}   />
      </div>
    );
}
