import Breadcrumbs from "@/components/shared/BreadCrumbs";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact"); 
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <Breadcrumbs />

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              {t("title")}
            </h1>

            {/* Información de contacto */}
            <section className="mt-6">
              <p className="mb-6 text-gray-700">
                {t("subtitle")}
              </p>

              <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                <p>
                  <strong className="text-[#2980B9]">📍 {t("addressLabel")}:</strong> <br />
                  {t("addressText")} <br />
                  {t("country")}
                </p>
                <p>
                  <strong className="text-[#2980B9]">📧 {t("email")}:</strong>{" "}
                  <a href="mailto:support@toydacity.com" className="text-[#3498DB] hover:underline">
                    support@toydacity.com
                  </a>
                </p>
                <p>
                  <strong className="text-[#2980B9]">📞 {t("phone")}:</strong> <br />
                  +1 (786) 479–8620
                </p>
                <p>
                  <strong className="text-[#2980B9]">🌐 {t("website")}:</strong>{" "}
                  <a
                    href="https://toydacity.com "
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3498DB] hover:underline"
                  >
                    www.toydacity.com
                  </a>
                </p>
              </div>
            </section>

            {/* Enlaces adicionales */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/policies"
                className="inline-block bg-[#3498DB] text-white px-4 py-2 rounded hover:bg-[#2980B9] transition-colors text-center"
              >
                {t("policy")}
              </Link>
              <Link
                href="/terms"
                className="inline-block bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-[#239A55] transition-colors text-center"
              >
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}