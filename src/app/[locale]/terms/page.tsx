import Breadcrumbs from "@/components/shared/BreadCrumbs";
import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <Breadcrumbs/>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              Toydacity Terms of Service
            </h1>
            <span className="text-gray-500 italic">Effective Date: Jun 18, 2025</span>

            {/* Introduction */}
            <section className="mt-4">
              <p className="mb-3 text-gray-700">
                Welcome to Toydacity! These Terms of Service (Terms) govern your access to and use of the Toydacity website, mobile applications, and related online services (collectively, the Services). Toydacity Inc. (Toydacity, we, us, or our) is a Florida-based platform created to support the buying, selling, trading, and gifting of secondhand toys. By using our Services, you agree to comply with and be bound by these Terms. If you do not agree, you must not use the Services.
              </p>
              <p className="mb-3 text-gray-700">
                We may revise these Terms at any time. Updated Terms will be posted with a new effective date. Your continued use of the Services constitutes your acceptance of any updates.
              </p>
            </section>

            {/* Section 1 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                1. Overview of Toydacity
              </h2>
              <p className="mb-3 text-gray-700">
                Toydacity connects individuals, families, and collectors through a trusted marketplace for secondhand toys. Our Services include listing tools, chat functionality, optional payment processing, shipping integration, safety verification features, and community guidelines. We are not a party to user-to-user transactions and do not hold inventory.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                2. User Eligibility
              </h2>
              <p className="mb-3 text-gray-700">
                To use Toydacity, you must:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Be at least 13 years old (users under 18 require a guardian&lsquo;s supervision)</li>
                <li>Reside in the United States or its territories</li>
                <li>Not have been previously banned or suspended from the platform</li>
              </ul>
              <p className="mb-3 text-gray-700">
                Businesses or organizations must be properly authorized to act on behalf of their legal entity.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                3. Account Responsibilities
              </h2>
              <p className="mb-3 text-gray-700">
                You must register an account to access most features. By creating an account, you agree to:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Provide accurate, updated information</li>
                <li>Maintain confidentiality of your login credentials</li>
                <li>Be responsible for activity on your account</li>
              </ul>
              <p className="mb-3 text-gray-700">
                We reserve the right to reclaim usernames and disable accounts that violate our Terms or policies.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                4. Types of Listings
              </h2>
              <p className="mb-3 text-gray-700">
                Toydacity allows:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li><strong>Standard Listings:</strong> Post secondhand toys for sale, trade, or giveaway.</li>
                <li><strong>Wanted Posts:</strong> Request specific toys from the community.</li>
                <li><strong>Job Postings:</strong> For businesses seeking toy-related staff (e.g., restoration, sales, logistics).</li>
                <li><strong>Service Listings:</strong> Toy repair, cleaning, or upcycling services.</li>
              </ul>
              <p className="mb-3 text-gray-700">
                All listings must be truthful and comply with applicable laws. Toydacity reserves the right to modify, flag, or remove listings at our discretion.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                5. Community Standards and Conduct
              </h2>
              <p className="mb-3 text-gray-700">
                You agree not to:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Post offensive, misleading, or illegal content</li>
                <li>Harass, stalk, or harm other users</li>
                <li>Circumvent posting limits or paid feature restrictions</li>
                <li>Infringe on intellectual property rights</li>
                <li>Use Toydacity for fraudulent or commercial resale purposes without authorization</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                6. Fees and Subscriptions
              </h2>
              <p className="mb-3 text-gray-700">
                While basic listings are free, Toydacity may charge for premium features such as:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Priority placement in search results</li>
                <li>Increased post visibility</li>
                <li>Business tools and job postings</li>
                <li>Subscription packages with monthly or annual benefits</li>
              </ul>
              <p className="mb-3 text-gray-700">
                Subscriptions are billed through your mobile platform and auto-renew unless canceled 24 hours before the next billing cycle. Paid services are non-refundable unless required by law.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                7. Payments and Shipping
              </h2>
              <p className="mb-3 text-gray-700 font-medium">
                Toydacity Payment Solution: For in-app payments and optional shipping within the contiguous U.S.
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li><strong>Sellers:</strong> Must register with Stripe and comply with our Packaging Guidelines.</li>
                <li><strong>Buyers:</strong> Payments are held until delivery is confirmed or the protection period expires.</li>
              </ul>
              <p className="mb-3 text-gray-700">
                Toydacity is not responsible for in-person payments or transactions made outside the platform.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                8. Prohibited Items
              </h2>
              <p className="mb-3 text-gray-700">
                The following may not be listed or shipped via Toydacity:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Firearms, explosives, and weapon replicas</li>
                <li>Hazardous chemicals or substances</li>
                <li>Drugs, medications, alcohol, tobacco</li>
                <li>Human remains or biological material</li>
                <li>Stolen, counterfeit, or pirated items</li>
                <li>Adult content or material unsuitable for children</li>
              </ul>
              <p className="mb-3 text-gray-700">
                Violations may result in account suspension, removal of content, and notification to legal authorities.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                9. Safety and Verification
              </h2>
              <p className="mb-3 text-gray-700">
                We encourage safe interactions and offer features like:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li><strong>TruYou Badge:</strong> Voluntary identity verification using government-issued ID</li>
                <li><strong>Community Meetup Spots:</strong> Locations recommended for local exchange (e.g., police departments, well-lit public areas)</li>
              </ul>
              <p className="mb-3 text-gray-700">
                However, Toydacity does not independently verify the safety of users or meetup locations. Exercise caution.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                10. User Content and Feedback
              </h2>
              <p className="mb-3 text-gray-700">
                By posting content, you grant Toydacity a worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with the Services. This includes listings, reviews, messages, photos, videos, and any information submitted voluntarily.
              </p>
              <p className="mb-3 text-gray-700">
                You may not post content that is:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Defamatory, obscene, or discriminatory</li>
                <li>Misleading or impersonating another individual</li>
                <li>A violation of another&lsquo;s rights or privacy</li>
              </ul>
              <p className="mb-3 text-gray-700">
                We reserve the right to remove or restrict access to content that violates these Terms.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                11. Intellectual Property
              </h2>
              <p className="mb-3 text-gray-700">
                All software, branding, layout, graphics, and platform code are the intellectual property of Toydacity or its licensors. Unauthorized reproduction or distribution is strictly prohibited.
              </p>
              <p className="mb-3 text-gray-700">
                You retain ownership of your User Content but grant us license rights to display it within the platform and for promotional use.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                12. Taxes and Regulatory Compliance
              </h2>
              <p className="mb-3 text-gray-700">
                Sellers are responsible for complying with local, state, and federal tax obligations. Toydacity may collect and remit sales tax where required. Users who exceed IRS reporting thresholds will be asked to provide taxpayer information to Stripe.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                13. Third-Party Services
              </h2>
              <p className="mb-3 text-gray-700">
                Our platform may integrate with services such as Stripe (payment processing) or Onfido (identity verification). Use of these services is subject to their own terms and privacy policies. Toydacity is not responsible for actions taken by third parties.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                14. Dispute Resolution
              </h2>
              <p className="mb-3 text-gray-700">
                We are not responsible for disputes between users. However, we offer:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>A reporting mechanism for misconduct or fraud</li>
                <li>Mediation for transactions completed through Toydacity&lsquo;s Payment Solution</li>
              </ul>
              <p className="mb-3 text-gray-700">
                Unresolved disputes may be escalated through binding arbitration as described below.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                15. Binding Arbitration Agreement
              </h2>
              <p className="mb-3 text-gray-700">
                All disputes arising from or relating to these Terms or the use of the Services shall be resolved through final, binding arbitration administered by JAMS under its Streamlined Rules. You waive your right to bring claims in court or as part of a class action.
              </p>
              <p className="mb-3 text-gray-700 font-medium">
                Opt-out instructions: You may opt out of arbitration within 30 days of first agreeing to these Terms by emailing support@toydacity.com with your name and account email.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                16. Termination
              </h2>
              <p className="mb-3 text-gray-700">
                We may suspend or terminate your access to the Services for any reason, including violation of these Terms. Termination may include deletion of listings and account data.
              </p>
              <p className="mb-3 text-gray-700">
                You may close your account at any time by contacting us. Sections relating to payments, content licensing, indemnification, and arbitration will survive termination.
              </p>
            </section>

            {/* Section 17 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                17. Disclaimers
              </h2>
              <p className="mb-3 text-gray-700">
                We do not guarantee uninterrupted access, data accuracy, or the success of transactions. Services are provided as is without warranties of any kind, express or implied. Your use of the Services is at your own risk.
              </p>
            </section>

            {/* Section 18 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                18. Limitation of Liability
              </h2>
              <p className="mb-3 text-gray-700">
                To the extent permitted by law, Toydacity shall not be liable for indirect, incidental, or consequential damages. Our total liability to you for any claim is limited to $100 or the amount you paid to Toydacity in the past 12 months.
              </p>
            </section>

            {/* Section 19 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                19. Indemnification
              </h2>
              <p className="mb-3 text-gray-700">
                You agree to indemnify, defend, and hold harmless Toydacity from any claims, liabilities, damages, losses, or expenses arising from your use of the Services, your content, or your breach of these Terms.
              </p>
            </section>

            {/* Section 20 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                20. Governing Law and Venue
              </h2>
              <p className="mb-3 text-gray-700">
                These Terms are governed by the laws of the State of Florida, without regard to its conflict of law principles. Any claims not subject to arbitration must be resolved in the state or federal courts of Florida.
              </p>
            </section>

            {/* Section 21 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                21. Contact Information
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-1 text-gray-700">
                  If you have questions, feedback, or need assistance, please contact us at:
                </p>
                <p className="mb-1 text-gray-700">
                  Email: <a href="mailto:support@toydacity.com" className="text-[#3498DB] hover:underline">support@toydacity.com</a>
                </p>
                <p className="mb-1 text-gray-700">
                  Address: Toydacity Inc., 2617 NW 55TH ST, FORT LAUDERDALE, FL 33309.
                </p>
              </div>
              <p className="mt-3 text-gray-700">
                Thank you for using Toydacity and helping promote sustainable, joyful toy sharing!
              </p>
            </section>

            {/* Additional Links */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/policies"
                className="inline-block bg-[#3498DB] text-white px-4 py-2 rounded hover:bg-[#2980B9] transition-colors text-center"
              >
                Privacy Policy
              </Link>
              <Link
                href="/deletedata"
                className="inline-block bg-[#E74C3C] text-white px-4 py-2 rounded hover:bg-[#C0392B] transition-colors text-center"
              >
                Request Data Deletion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}