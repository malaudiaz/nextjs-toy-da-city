import Link from "next/link";

export default function DeleteDataPage() {
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              How to Delete Your Account/Data
            </h1>

            {/* Self Service Section */}
            <section className="mt-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                Self Service:
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Go to Settings {'>'} Privacy {'>'} Delete Account.</li>
                <li>Confirm via email.</li>
              </ul>
            </section>

            {/* Manual Request Section */}
            <section className="mt-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                Manual Request:
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Email privacy@toydacity.com with:</li>
                <li>Subject: Data Deletion Request.</li>
                <li>Body: Specify if deleting all data or specific listings.</li>
              </ul>
            </section>

            {/* Florida-Specific Notes */}
            <section className="mt-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                Florida-Specific Notes:
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>Deletion completed within 30 days (per CCPA/SB 262).</li>
                <li>Transaction records may be retained for tax purposes (Florida Statute 212.03).</li>
              </ul>
            </section>

            {/* Full Document Link */}
            <div className="mt-6">
              <Link 
                href="/" 
                className="text-[#3498DB] hover:underline font-medium"
              >
                Full Document Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}