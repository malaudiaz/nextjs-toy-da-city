import Link from "next/link";

export default function TermsCondiion() {
  return (
    <div className="container mx-auto px-6 py-8 bg-[#FAF1DE] min-h-screen">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">1. Introduction</h1>
      <p className="text-justify">
       "Toydacity is an online marketplace for pre-owned toys,
        connecting buyers, sellers, and donors. By using our platform, you agree
        to these Terms."
      </p>
      <h1 className="text-2xl font-bold">2. User Responsibilities</h1>

      <p className="text-justify">
        Prohibited Items: Counterfeit toys, recalled items, or weapons. Listings
        with misleading conditions (e.g., "new" when used). <br />Transactions:
        Toydacity is not a party to sales/swaps; users resolve disputes
        independently.
      </p>

      <h1 className="text-2xl font-bold">3. Account Termination</h1>

      <p className="text-justify">
        We may suspend accounts for: Fraudulent listings. Harassment via chat.
      </p>

      <h1 className="text-2xl font-bold">4. Florida-Specific Clause</h1>
      <p className="text-justify"> 
        "Florida residents may report issues to the Florida Department of
        Agriculture and Consumer Services (FDACS)."
      </p>

      <Link href={"/"}>Full Document Link</Link>
      </div>
    </div>
  );
}
