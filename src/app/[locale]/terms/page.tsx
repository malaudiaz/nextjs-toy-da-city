import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              Toydacity Terms of Service
            </h1>
            <span className="text-gray-500 italic">Last Updated: [Date]</span>

            {/* Introduction */}
            <section className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                1. Introduction
              </h2>
              <p className="mb-3 text-gray-700">
                Welcome to Toydacity, the leading platform for buying, selling, and trading pre-owned toys. By accessing or using our services through <a href="http://www.toydacity.com/" target="_blank" rel="noopener noreferrer" className="text-[#3498DB] hover:underline">www.toydacity.com</a>, mobile applications, or any other means (collectively, the "Service"), you agree to comply with these Terms of Service.
              </p>
              <p className="mb-3 text-gray-700">
                These terms constitute a legal agreement between you and Toydacity Inc. If you do not agree with these terms, please do not use our Service.
              </p>
            </section>

            {/* Eligibility */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                2. Eligibility
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>You must be at least 18 years old to use our Service.</li>
                <li>Users between 13 and 17 years old may use the Service only under parental or guardian supervision.</li>
                <li>Use of the Service by children under 13 is prohibited.</li>
                <li>You agree to provide accurate and current information in your account.</li>
              </ul>
            </section>

            {/* Service Usage */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                3. Service Usage
              </h2>
              
              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                3.1 Conduct Guidelines
              </h3>
              <p className="mb-3 text-gray-700">
                When using Toydacity, you agree:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Not to post false, misleading, or illegal content.</li>
                <li>Not to infringe on third-party intellectual property rights.</li>
                <li>Not to use the Service for fraudulent activities.</li>
                <li>Not to sell toys that have been recalled for safety reasons.</li>
                <li>Not to interfere with the security or operation of the Service.</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                3.2 Toy Listings
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>You must accurately describe the toy's condition (new, like new, used, etc.).</li>
                <li>Photos must truthfully represent the item.</li>
                <li>Duplicate listings of the same item are not allowed.</li>
                <li>Toydacity reserves the right to remove listings that violate our policies.</li>
              </ul>
            </section>

            {/* Transactions */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                4. Transactions and Payments
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Toydacity acts as a platform but is not a party to transactions between users.</li>
                <li>Payments are processed through Stripe, Inc. and are subject to their terms.</li>
                <li>You are responsible for declaring income according to applicable tax laws.</li>
                <li>Disputes between users must be resolved directly between the parties.</li>
                <li>Toydacity may suspend transactions suspected of fraud.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                5. Intellectual Property
              </h2>
              <p className="mb-3 text-gray-700">
                All Service content (logos, text, graphics) is property of Toydacity Inc. or its licensors and is protected by intellectual property laws.
              </p>
              <p className="mb-4 text-gray-700">
                By posting content on Toydacity, you grant us a non-exclusive license to use, display, and distribute such content in connection with the Service.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                6. Limitation of Liability
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Toydacity does not guarantee the quality, safety, or legality of listed toys.</li>
                <li>We are not responsible for failed transactions or disputes between users.</li>
                <li>Use of the Service is at your own risk.</li>
                <li>In no event shall Toydacity be liable for indirect or consequential damages.</li>
              </ul>
            </section>

            {/* Modifications */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                7. Modifications to Terms
              </h2>
              <p className="mb-3 text-gray-700">
                We may occasionally modify these terms. Significant updates will be communicated via email or Service notifications.
              </p>
              <p className="mb-4 text-gray-700">
                Your continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Termination */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                8. Termination
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>You may close your account at any time from settings.</li>
                <li>Toydacity may suspend or terminate your access for violations of these terms.</li>
                <li>Provisions regarding intellectual property, liability limitations, and others will survive termination.</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                9. Governing Law
              </h2>
              <p className="mb-4 text-gray-700">
                These terms shall be governed by Florida state law, without regard to conflict of law provisions. Any disputes shall be resolved in the competent courts of Miami-Dade County, Florida.
              </p>
            </section>

            {/* Contact */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                10. Contact
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-1 text-gray-700">
                  <strong>Legal Department</strong>
                </p>
                <p className="mb-1 text-gray-700">Toydacity, Inc.</p>
                <p className="mb-1 text-gray-700">123 Toy Lane, Seattle, WA 98101</p>
                <p className="mb-1 text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:legal@toydacity.com"
                    className="text-[#3498DB] hover:underline"
                  >
                    legal@toydacity.com
                  </a>
                </p>
                <p className="text-gray-700">Phone: (800) 555-TOYS (ext. 3)</p>
              </div>
            </section>

            {/* Additional Links */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/privacy"
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