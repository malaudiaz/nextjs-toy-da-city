import { Toaster } from "sonner";
import {getSellerProfile } from "@/lib/actions/sellertActions";
import SellerInfo from "@/components/shared/seller/SellerInfo";
import SellerToysForSale from "@/components/shared/seller/SellerToysForSale";
import SellerBuyerReviews from "@/components/shared/seller/SellerBuyerReviews";
import { Suspense } from "react";
import SellerInfoSkeleton from "@/components/shared/seller/SellerInfoSkeleton";
import SellerToysForSaleSkeleton from "@/components/shared/seller/SellerToysForSaleSkeleton";
import SellerBuyerReviewsSkeleton from "@/components/shared/seller/SellerBuyerReviewsSkeleton";



export default async function SellerProfilePage({ params }: { params: Promise<{ id: string}> }) {

  const { id: sellerId } = await params;
  const data = await getSellerProfile(sellerId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <Suspense fallback={<SellerInfoSkeleton/>}>
            <SellerInfo data={data} />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<SellerToysForSaleSkeleton/>}>
     <SellerToysForSale data={data.toysForSale} />
      </Suspense>

    <Suspense fallback={<SellerBuyerReviewsSkeleton/>}>
      <SellerBuyerReviews data={data} />
    </Suspense>

    </div>
  );
}
