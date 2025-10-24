import Breadcrumbs from "@/components/shared/BreadCrumbs";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// SEO: metadatos dinámicos
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Puedes personalizar el título y descripción por idioma
  const t = await getTranslations("seo");
  const resolvedParams = await params;
  
  const { locale } = resolvedParams;
  
  return {
    title: t("homeTitle", { locale: locale }) || "Toydacity - Juguetes, intercambio y regalos",
    description:
      t("homeDescription", { locale: locale }) ||
      "Descubre, compra, intercambia y regala juguetes en Toydacity. Encuentra las mejores ofertas y conecta con otros padres.",
    keywords: ["toys", "juguetes", "swap", "intercambio", "gift", "regalos", "padres", "donaciones", "donate", "donation", "toydacity", "toydacity", "toydacity.es", "toydacity.com", "toydacity.net", "toydacity.org", "toydacity.info", "toydacity.co", "toydacity.io", "toydacity.eu", "toydacity.tv", "toydacity.club", "toydacity.online", "toydacity.app", "toydacity.xyz", "es.toydacity.com", "com.toydacity.es", "net.toydacity.es", "org.toydacity.es", "info.toydacity.es", "co.toydacity.es", "io.toydacity.es", "eu.toydacity.es", "tv.toydacity.es", "club.toydacity.es", "online.toydacity.es", "app.toydacity.es", "xyz.toydacity.es"],
    alternates: {
      canonical: `https://toydacity.com/${locale}`,
    },
    openGraph: {
      title: t("homeTitle", { locale: locale }) || "Toydacity - Juguetes, intercambio y regalos",
      description:
        t("homeDescription", { locale: locale }) ||
        "Descubre, compra, intercambia y regala juguetes en Toydacity.",
      url: `https://toydacity.com/${locale}`,
      siteName: "Toydacity.com",
      images: [
        {
          url: "/Logo.png",
          width: 600,
          height: 200,
          alt: "Toydacity logo",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@toydacity",
      title: t("homeTitle", { locale: locale }) || "Toydacity - Juguetes, intercambio y regalos",
      description:
        t("homeDescription", { locale: locale }) ||
        "Descubre, compra, intercambia y regala juguetes en Toydacity.",
      images: [
        {
          url: "/Logo.png",
          width: 600,
          height: 200,
          alt: "Toydancy logo",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
};

export default async function TermsOfUse() {
  const t = await getTranslations("terms");

  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <Breadcrumbs />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              {t("Title")}
            </h1>
            <span className="text-gray-500 italic">{t("EffectiveDate")}</span>

            {/* Introduction */}
            <section className="mt-4">
              <p className="mb-3 text-gray-700">{t("Welcome")}</p>
              <p className="mb-3 text-gray-700">{t("IntroductionRevision")}</p>
            </section>

            {/* Section 1 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section1Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section1Content")}</p>
            </section>

            {/* Section 2 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section2Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section2Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section2List1")}</li>
                <li>{t("Section2List2")}</li>
                <li>{t("Section2List3")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section2Business")}</p>
            </section>

            {/* Section 3 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section3Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section3Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section3List1")}</li>
                <li>{t("Section3List2")}</li>
                <li>{t("Section3List3")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section3Note")}</p>
            </section>

            {/* Section 4 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section4Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section4Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section4List1")}</strong>
                </li>
                <li>
                  <strong>{t("Section4List2")}</strong>
                </li>
                <li>
                  <strong>{t("Section4List3")}</strong>
                </li>
                <li>
                  <strong>{t("Section4List4")}</strong>
                </li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section4Note")}</p>
            </section>

            {/* Section 5 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section5Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section5Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section5List1")}</li>
                <li>{t("Section5List2")}</li>
                <li>{t("Section5List3")}</li>
                <li>{t("Section5List4")}</li>
                <li>{t("Section5List5")}</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section6Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section6Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section6List1")}</li>
                <li>{t("Section6List2")}</li>
                <li>{t("Section6List3")}</li>
                <li>{t("Section6List4")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section6Note")}</p>
            </section>

            {/* Section 7 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section7Title")}
              </h2>
              <p className="mb-3 text-gray-700 font-medium">{t("Section7Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section7Seller")}</strong>
                </li>
                <li>
                  <strong>{t("Section7Buyer")}</strong>
                </li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section7Note")}</p>
            </section>

            {/* Section 8 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section8Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section8Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section8List1")}</li>
                <li>{t("Section8List2")}</li>
                <li>{t("Section8List3")}</li>
                <li>{t("Section8List4")}</li>
                <li>{t("Section8List5")}</li>
                <li>{t("Section8List6")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section8Note")}</p>
            </section>

            {/* Section 9 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section9Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section9Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9List1")}</strong>
                </li>
                <li>
                  <strong>{t("Section9List2")}</strong>
                </li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section9Note")}</p>
            </section>

            {/* Section 10 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section10Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section10Content")}</p>
              <p className="mb-3 text-gray-700">{t("Section10Warning")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section10List1")}</li>
                <li>{t("Section10List2")}</li>
                <li>{t("Section10List3")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section10Note")}</p>
            </section>

            {/* Section 11 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section11Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section11Content")}</p>
              <p className="mb-3 text-gray-700">{t("Section11UserContent")}</p>
            </section>

            {/* Section 12 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section12Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section12Content")}</p>
            </section>

            {/* Section 13 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section13Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section13Content")}</p>
            </section>

            {/* Section 14 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section14Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section14Content")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section14List1")}</li>
                <li>{t("Section14List2")}</li>
              </ul>
              <p className="mb-3 text-gray-700">{t("Section14Note")}</p>
            </section>

            {/* Section 15 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section15Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section15Content")}</p>
              <p className="mb-3 text-gray-700 font-medium">{t("Section15OptOut")}</p>
            </section>

            {/* Section 16 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section16Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section16Content")}</p>
              <p className="mb-3 text-gray-700">{t("Section16AccountClosure")}</p>
            </section>

            {/* Section 17 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section17Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section17Content")}</p>
            </section>

            {/* Section 18 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section18Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section18Content")}</p>
            </section>

            {/* Section 19 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section19Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section19Content")}</p>
            </section>

            {/* Section 20 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section20Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section20Content")}</p>
            </section>

            {/* Section 21 */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section21Title")}
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-1 text-gray-700">{t("Section21Contact")}</p>
                <p className="mb-1 text-gray-700">
                  {t("Section21Email")}{" "}
                  <a href="mailto:support@toydacity.com" className="text-[#3498DB] hover:underline">
                    support@toydacity.com
                  </a>
                </p>
                <p className="mb-1 text-gray-700">{t("Section21Address")}</p>
              </div>
              <p className="mt-3 text-gray-700">{t("Section21ThankYou")}</p>
            </section>

            {/* Additional Links */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/policies"
                className="inline-block bg-[#3498DB] text-white px-4 py-2 rounded hover:bg-[#2980B9] transition-colors text-center"
              >
                {t("PrivacyPolicy")}
              </Link>
              <Link
                href="/deletedata"
                className="inline-block bg-[#E74C3C] text-white px-4 py-2 rounded hover:bg-[#C0392B] transition-colors text-center"
              >
                {t("RequestDataDeletion")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}