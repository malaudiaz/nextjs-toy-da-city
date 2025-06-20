import Breadcrumbs from "@/components/shared/BreadCrumbs";
import Link from "next/link";

export default function Policies() {
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <Breadcrumbs />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              Toydacity Privacy Policy
            </h1>
            <span className="text-gray-500 italic">Last Updated: [Date]</span>

            {/* Sección 1 text-[#2980B9] */}
            <section className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                1. Introduction
              </h2>
              <p className="mb-3 text-gray-700">
                Toydacity Inc. operates an online platform enabling users to
                buy, sell, trade, and gift pre-owned toys through our website (
                <a
                  href="http://www.toydacity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3498DB] hover:underline"
                >
                  www.toydacity.com
                </a>
                ), mobile applications, and related services (collectively, the
                Toydacity Service). This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                interact with our Service.
              </p>
              <p className="mb-3 text-gray-700">
                By accessing or using Toydacity, you consent to the practices
                described herein. We may modify this policy periodically;
                material changes will be communicated via email, in-app
                notifications, or by updating the Last Updated date. Your
                continued use constitutes acceptance.
              </p>
              <p className="mb-3 text-gray-700 font-medium">
                For residents of California, Florida, Virginia, Colorado,
                Connecticut, and other jurisdictions with specific privacy laws,
                refer to Section 9 (State-Specific Disclosures).
              </p>
            </section>

            {/* Sección 2 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                2. Information We Collect
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                2.1 Information You Provide Directly
              </h3>
              <p className="mb-3 text-gray-700">
                We collect data you voluntarily submit when:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Creating an account</strong>: Full name, email
                  address, encrypted password, phone number, postal address (for
                  local transactions), and profile photo.
                </li>
                <li>
                  <strong>Listing toys</strong>: Photographs, descriptions
                  (e.g., brand, age range, condition), pricing, and location
                  tags.
                </li>
                <li>
                  <strong>Communicating</strong>: Messages with other users,
                  customer support tickets, and public reviews/ratings.
                </li>
                <li>
                  <strong>Verifying identity</strong>: For enhanced trust
                  programs (e.g., Toydacity Verified Seller), we may request
                  government-issued IDs (e.g., drivers license) or utility
                  bills, processed securely via third-party services like Jumio.
                </li>
                <li>
                  <strong>Payment processing</strong>: While Toydacity does not
                  directly handle payment details, we facilitate transactions
                  through Stripe, Inc., which collects banking information,
                  Social Security numbers (for sellers), and tax forms per their
                  Privacy Policy.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Device/Log Data</strong>: IP address, browser type,
                  operating system, hardware model, unique device identifiers
                  (e.g., IMEI), mobile network data, and timestamps.
                </li>
                <li>
                  <strong>Usage Analytics</strong>: Pages visited, clickstream
                  patterns, search queries, time spent on listings, and
                  interaction metrics (e.g., favorites, shares).
                </li>
                <li>
                  <strong>Location Information</strong>: Precise GPS coordinates
                  (if enabled via device permissions) or approximate location
                  derived from IP addresses to facilitate local transactions.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies</strong>:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Essential cookies</strong>: Session management and
                      security (e.g., CSRF tokens).
                    </li>
                    <li>
                      <strong>Performance cookies</strong>: Google Analytics to
                      monitor traffic patterns.
                    </li>
                    <li>
                      <strong>Advertising cookies</strong>: Facebook Pixel and
                      Google Ads for retargeting (opt-out instructions in
                      Section 6.3).
                    </li>
                    <li>
                      <strong>Web beacons</strong>: Embedded in emails to track
                      open rates.
                    </li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                2.3 Information from Third Parties
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Social media</strong>: If you register via
                  Facebook/Google, we receive profile data (name, email, friend
                  lists) as permitted by their platforms.
                </li>
                <li>
                  <strong>Background checks</strong>: For fraud prevention, we
                  may cross-reference data with public databases (e.g., OFAC
                  sanctions lists) via services like Socure.
                </li>
                <li>
                  <strong>Payment processors</strong>: Stripe provides
                  transaction confirmations, dispute records, and limited KYC
                  data.
                </li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                3. How We Use Your Information
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                3.1 Service Operations
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  Facilitate toy transactions, including bid processing,
                  messaging, and payment confirmations.
                </li>
                <li>
                  Personalize recommendations (e.g., Trending LEGO Sets Near
                  You).
                </li>
                <li>
                  Verify identities to reduce fraud (e.g., flagging counterfeit
                  toys).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                3.2 Safety and Compliance
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  Detect and prevent scams, money laundering, or illegal items
                  (e.g., recalled toys).
                </li>
                <li>
                  Resolve disputes between users through transaction logs and
                  chat histories.
                </li>
                <li>
                  Comply with legal requests (e.g., subpoenas, tax reporting).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                3.3 Marketing and Improvements
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  Send promotional emails (opt-out anytime) about seasonal toy
                  drives or discounts.
                </li>
                <li>Conduct A/B testing to improve UI/UX.</li>
                <li>
                  Share aggregated trends with partners (e.g., Most Traded Toys
                  of 2025).
                </li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                4. Data Sharing and Disclosure
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                4.1 With Other Users
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Public profiles</strong>: Username, city, and average
                  response time.
                </li>
                <li>
                  <strong>Listings</strong>: Photos, descriptions, and
                  approximate location (e.g., 3 miles away).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                4.2 With Service Providers
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Cloud hosting</strong>: AWS for data storage.
                </li>
                <li>
                  <strong>Customer support</strong>: Zendesk for ticket
                  management.
                </li>
                <li>
                  <strong>Advertising networks</strong>: Meta and Google for
                  targeted ads (anonymized where possible).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                4.3 Legal and Business Transfers
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Law enforcement</strong>: When required to investigate
                  harm or illegal activity (e.g., child safety violations).
                </li>
                <li>
                  <strong>Mergers/Acquisitions</strong>: Data transfer to
                  successors, with user notification.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                4.4 Aggregate/De-Identified Data
              </h3>
              <p className="mb-4 text-gray-700">
                Shared for market research (e.g., 70% of users trade toys
                within 10 miles).
              </p>
            </section>

            {/* Sección 5 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                5. Data Security
              </h2>
              <p className="mb-3 text-gray-700">We implement:</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Encryption</strong>: AES-256 for data at rest, TLS 1.3
                  for transmissions.
                </li>
                <li>
                  <strong>Access controls</strong>: Role-based permissions for
                  employees.
                </li>
                <li>
                  <strong>Audits</strong>: Annual penetration testing by
                  third-party firms.
                </li>
              </ul>
              <p className="mb-4 text-gray-700 font-medium">
                No system is 100% secure—promptly report suspicious activity to{" "}
                <a
                  href="mailto:security@toydacity.com"
                  className="text-[#3498DB] hover:underline"
                >
                  security@toydacity.com
                </a>
                .
              </p>
            </section>

            {/* Sección 6 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                6. Your Choices
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                6.1 Account Settings
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  Edit profile or delete account via{" "}
                  <strong>Settings &gt; Account Management</strong>.
                </li>
                <li>
                  Note: Transaction histories may be retained for legal
                  compliance.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                6.2 Location and Cookies
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Disable GPS tracking via device settings.</li>
                <li>
                  Reject non-essential cookies via our{" "}
                  <strong>Cookie Banner</strong>.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                6.3 Advertising Opt-Outs
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Digital Advertising Alliance</strong>:{" "}
                  <a
                    href="https://optout.aboutads.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3498DB] hover:underline"
                  >
                    YourAdChoices
                  </a>
                  .
                </li>
                <li>
                  <strong>Mobile devices</strong>: Limit ad tracking in
                  iOS/Android settings.
                </li>
              </ul>
            </section>

            {/* Sección 7 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                7. Children&lsquo;s Privacy
              </h2>
              <p className="mb-3 text-gray-700">
                Toydacity is committed to protecting the privacy of children and
                complying with all applicable laws, including the U.S.
                Children&lsquo;s Online Privacy Protection Act (COPPA).
              </p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                7.1 Age Restrictions
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>Under 13</strong>: The Toydacity Service is not intended
                for children under 13 years of age. We do not knowingly collect,
                use, or disclose personal information from children under 13
                without verifiable parental consent.
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Ages 13–17</strong>: Minors aged 13–17 may only use
                Toydacity under the supervision of a parent or legal guardian,
                who assumes responsibility for their compliance with our Terms
                of Service.
              </p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                7.2 Parental Controls & Responsibilities
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>Guardian Oversight</strong>: Parents/guardians must
                review and approve their child&lsquo;s account creation and monitor
                activity.
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Parental Consent</strong>: If we discover that a child
                under 13 has provided personal information (e.g., via falsified
                age verification), we will:
              </p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>Immediately suspend the account.</li>
                <li>
                  Notify the parent/guardian (if contact details are available).
                </li>
                <li>
                  Delete all collected data unless retention is required by law
                  (e.g., fraud investigations).
                </li>
              </ul>
              <p className="mb-3 text-gray-700">
                <strong>Verification Process</strong>: For accounts suspected of
                belonging to underage users, we may request:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Proof of parental consent (e.g., signed consent form).</li>
                <li>Government-issued ID to confirm guardian identity.</li>
              </ul>
            </section>

            {/* Sección 8 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                8. International Data Transfers
              </h2>
              <p className="mb-4 text-gray-700">
                Data is processed in the U.S. Non-U.S. users consent to this
                transfer.
              </p>
            </section>

            {/* Sección 9 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                9. State-Specific Disclosures
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.1 California Residents (CCPA/CPRA)
              </h3>
              <p className="mb-3 text-gray-700">
                Under the{" "}
                <strong>
                  California Consumer Privacy Act (as amended by the CPRA)
                </strong>
                , you have the right to:
              </p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>
                  <strong>Request Access/Portability</strong>: Receive a
                  detailed report (covering the past 12 months) of:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Categories of personal data collected (e.g.,
                      identifiers, commercial information, geolocation).
                    </li>
                    <li>
                      Specific pieces of data (e.g., message transcripts,
                      transaction amounts).
                    </li>
                    <li>Third parties with whom data was shared/sold.</li>
                  </ul>
                </li>
                <li>
                  <strong>Delete Data</strong>: Request erasure of personal
                  data, except where retention is required (e.g., fraud
                  investigations, tax compliance).
                </li>
                <li>
                  <strong>Correct Inaccuracies</strong>: Update outdated or
                  incorrect profile/transaction details.
                </li>
                <li>
                  <strong>Opt-Out of Sales/Sharing</strong>: Disable
                  ad-targeting via{" "}
                  <strong>
                    Settings &gt; Privacy &gt; Limit Data Sharing
                  </strong>
                  .
                </li>
                <li>
                  <strong>Limit Sensitive Data Use</strong>: Restrict processing
                  of government IDs or precise location.
                </li>
                <li>
                  <strong>Non-Discrimination</strong>: No denial of services for
                  exercising rights.
                </li>
              </ul>
              <p className="mb-3 text-gray-700 font-medium">
                Submission Methods:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:privacy@toydacity.com"
                    className="text-[#3498DB] hover:underline"
                  >
                    privacy@toydacity.com
                  </a>{" "}
                  (subject line: CA Privacy Request).
                </li>
                <li>Toll-Free: 1-800-555-TOYS (ext. 2).</li>
                <li>
                  <strong>Verification</strong>: Requires matching account
                  email/phone and government-issued ID (for sensitive requests).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.2 Florida Residents (Florida Digital Bill of Rights, Effective
                July 2024)
              </h3>
              <p className="mb-3 text-gray-700">
                As Toydacity&lsquo;s headquarters is in <strong>Miami, FL</strong>, we
                adhere to the{" "}
                <strong>Florida Digital Bill of Rights (FDBR)</strong>:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Parental Consent</strong>: Strictly prohibit data
                  collection from users under <strong>18</strong> without
                  verifiable parental consent (aligned with our general{" "}
                  <strong>under-13 prohibition</strong>).
                </li>
                <li>
                  <strong>Targeted Advertising Opt-Out</strong>: Florida minors
                  are automatically excluded from ad targeting. Adults may opt
                  out via{" "}
                  <strong>
                    Settings &gt; Ads &gt; Disable Personalized Ads
                  </strong>
                  .
                </li>
                <li>
                  <strong>Data Broker Prohibition</strong>: Toydacity does not
                  sell data to third-party brokers.
                </li>
                <li>
                  <strong>Right to Appeal</strong>: Contest denied requests
                  within <strong>30 days</strong> via our{" "}
                  <strong>Privacy Portal</strong>.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.3 Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA)
              </h3>
              <p className="mb-3 text-gray-700">Residents may:</p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>
                  <strong>Confirm Processing</strong>: Request disclosure of
                  data categories (e.g., payment records, device
                  identifiers).
                </li>
                <li>
                  <strong>Obtain Portable Data</strong>: Receive
                  machine-readable copies (JSON/CSV) of provided data.
                </li>
                <li>
                  <strong>Correct Errors</strong>: Rectify inaccuracies in
                  listings or account details.
                </li>
                <li>
                  <strong>Opt-Out of</strong>:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Targeted advertising.</li>
                    <li>
                      Profiling for automated decisions (e.g., fraud risk
                      scoring).
                    </li>
                    <li>
                      Data sales (though Toydacity only shares data for service
                      operations, not monetary gain).
                    </li>
                  </ul>
                </li>
              </ul>
              <p className="mb-4 text-gray-700 font-medium">
                Response Timeline: 45 days (extendable to 90 with notice).
              </p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.4 Texas Residents (Texas Data Privacy and Security Act,
                Effective July 2024)
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Universal Opt-Out Mechanism</strong>: Honor
                  browser-based signals (e.g., Global Privacy Control) for data
                  sales/targeted ads.
                </li>
                <li>
                  <strong>Biometric Data Notice</strong>: Toydacity does not
                  collect facial recognition or fingerprint data.
                </li>
                <li>
                  <strong>Right to Appeal</strong>: Submit appeals via{" "}
                  <a
                    href="mailto:privacy@toydacity.com"
                    className="text-[#3498DB] hover:underline"
                  >
                    privacy@toydacity.com
                  </a>{" "}
                  (responded to within 60 days).
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.5 Utah Residents (Utah Consumer Privacy Act, Effective Dec
                2024)
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Opt-Out Requirements</strong>: Limited to sales and
                  targeted ads (exempts small businesses; Toydacity complies
                  voluntarily).
                </li>
                <li>
                  <strong>Data Minimization</strong>: Collect only what is
                  reasonably necessary for toy transactions.
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                9.6 Nevada Residents (SB 220)
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>Do-Not-Sell Requests</strong>: Email{" "}
                  <a
                    href="mailto:optout@toydacity.com"
                    className="text-[#3498DB] hover:underline"
                  >
                    optout@toydacity.com
                  </a>{" "}
                  to exclude data from sales (defined narrowly under Nevada
                  law).
                </li>
              </ul>
            </section>

            {/* Sección 10 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold  mb-3">
                10. Contact Us
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-1 text-gray-700">
                  <strong>Privacy Officer</strong>
                </p>
                <p className="mb-1 text-gray-700">Toydacity, Inc.</p>
                <p className="mb-1 text-gray-700">
                  123 Toy Lane, Seattle, WA 98101
                </p>
                <p className="mb-1 text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:privacy@toydacity.com"
                    className="text-[#3498DB] hover:underline"
                  >
                    privacy@toydacity.com
                  </a>
                </p>
                <p className="text-gray-700">Phone: (800) 555-TOYS</p>
              </div>
            </section>

            {/* Enlace adicional */}
            <div className="mt-6">
              <Link
                href="/deletedata"
                className="inline-block bg-[#3498DB] text-white px-4 py-2 rounded hover:bg-[#2980B9] transition-colors"
              >
                Delete Data Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
