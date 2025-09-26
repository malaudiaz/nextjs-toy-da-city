import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function DeleteDataPage() {
  const t = await getTranslations("deleteData"); 

  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              {t("title")}
            </h1>

            {/* Self Service Section */}
            <section className="mt-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                {t("selfService")}
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("goToSettings")} {'>'} {t("privacy")} {'>'} {t("deleteAccount")}</li>
                <li>{t("confirmEmail")}</li>
              </ul>
            </section>

            {/* Manual Request Section */}
            <section className="mt-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                {t("manualRequest")}
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("email")}</li>
                <li>{t("subject")}</li>
                <li>{t("body")}</li>
              </ul>
            </section>

            {/* Florida-Specific Notes */}
            <section className="mt-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2980B9] mb-3">
                {t("floridaSpecific")}
              </h2>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("deleteData")}</li>
                <li>{t("transactions")}</li>
              </ul>
            </section>

            {/* Full Document Link */}
            <div className="mt-6">
              <Link 
                href="/" 
                className="text-[#3498DB] hover:underline font-medium"
              >
                {t("fullDocumentLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}