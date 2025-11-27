import Breadcrumbs from "@/components/shared/BreadCrumbs";
import ReviewClient from "@/components/shared/reviews/ReviewClient";
import { getReviewsEligible, getSellerProfile } from "@/lib/actions/sellertActions";

export default async function ReviewPage({ params }: { params: Promise<{ sellerId: string }>; }) {
  const { sellerId } = await params;

  const seller = await getSellerProfile(sellerId);
  const reviewsEligible = await getReviewsEligible(sellerId);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">

      <div className="py-3">
        <Breadcrumbs productName={seller.name} ignoreSegment="reviews"/>
      </div>

     <ReviewClient seller={seller} reviewsEligible={reviewsEligible}/>
    </div>
  );
}
