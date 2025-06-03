"use client";
import Link from "next/link";

export default function Policies() {
  return (
    <div className="container mx-auto px-6 py-8 bg-[#FAF1DE] min-h-screen">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">1. Data Collected</h1>
        <p className="text-justify">
          Required: Name, email, toy photos, payment details (via
          Stripe/PayPal). <br />
          Optional: Location (for Near Me filters), child’s age (for donation
          matching).
        </p>
        <h1 className="text-2xl font-bold">2. How We Use Data</h1>

        <p className="text-justify">
          Facilitate transactions. <br />
          No Selling: We do not sell data to third parties (CCPA compliance).
        </p>

        <h1 className="text-2xl font-bold">3. Children’s Privacy (COPPA)</h1>

        <p className="text-justify">
          Users must be 13+; parents may request deletion of a child’s data via
          email.
        </p>

        <h1 className="text-2xl font-bold">4. Your Rights</h1>
        <p className="text-justify">
          Delete Data: Use the in-app tool or email privacy@toydacity.com.
          <br />
          Opt-Out: Toggle off <b>Personalized Ads</b> in Settings.
        </p>

        <Link href={"/deletedata"}>Full Document Link</Link>
      </div>
    </div>
  );
}
