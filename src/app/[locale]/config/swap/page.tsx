import SwapInfo from "@/components/shared/profile/SwapInfo";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import { getSwaps } from "@/lib/actions/toysAction";

export default async function ExchangesPage() {
  const swaps = await getSwaps()
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-background">
        <div className="px-5 py-3">
        <TitleBreakcrumbs translationScope="swap" />
        </div>
        <SwapInfo swaps={swaps}   />
      </div>
    );
}
