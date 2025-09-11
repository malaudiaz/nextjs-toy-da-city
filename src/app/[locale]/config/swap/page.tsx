import Breadcrumbs from "@/components/shared/BreadCrumbs";
import SwapInfo from "@/components/shared/profile/SwapInfo";
import { getSwaps } from "@/lib/actions/toysAction";

export default async function ExchangesPage() {
  const swaps = await getSwaps()
    return (
      <div>
        <div className="px-5 py-3 md:hidden ">
          <Breadcrumbs />
        </div>
        <SwapInfo swaps={swaps}   />
      </div>
    );
}
