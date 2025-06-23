import Breadcrumbs from "@/components/shared/BreadCrumbs";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Policies() {
  const t = await getTranslations("policies");

  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <Breadcrumbs />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              {t("Title")}
            </h1>
            <span className="text-gray-500 italic">{t("LastUpdated")}</span>

            {/* Sección 1 - Introducción */}
            <section className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section1Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section1Intro")}</p>
              <p className="mb-3 text-gray-700">{t("Section1Consent")}</p>
              <p className="mb-3 text-gray-700 font-medium">{t("Section1StateNote")}</p>
            </section>

            {/* Sección 2 - Información que recopilamos */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section2Title")}
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section2Sub1Title")}
              </h3>
              <p className="mb-3 text-gray-700">{t("Section2Sub1Intro")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section2Sub1ListItem1Title")}</strong>: {t("Section2Sub1ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub1ListItem2Title")}</strong>: {t("Section2Sub1ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub1ListItem3Title")}</strong>: {t("Section2Sub1ListItem3Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub1ListItem4Title")}</strong>: {t("Section2Sub1ListItem4Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub1ListItem5Title")}</strong>: {t("Section2Sub1ListItem5Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section2Sub2Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section2Sub2ListItem1Title")}</strong>: {t("Section2Sub2ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub2ListItem2Title")}</strong>: {t("Section2Sub2ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub2ListItem3Title")}</strong>: {t("Section2Sub2ListItem3Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub2ListItem4Title")}</strong>:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>{t("Section2Sub2ListItem4Sub1Title")}</strong>: {t("Section2Sub2ListItem4Sub1Desc")}
                    </li>
                    <li>
                      <strong>{t("Section2Sub2ListItem4Sub2Title")}</strong>: {t("Section2Sub2ListItem4Sub2Desc")}
                    </li>
                    <li>
                      <strong>{t("Section2Sub2ListItem4Sub3Title")}</strong>: {t("Section2Sub2ListItem4Sub3Desc")}
                    </li>
                    <li>
                      <strong>{t("Section2Sub2ListItem4Sub4Title")}</strong>: {t("Section2Sub2ListItem4Sub4Desc")}
                    </li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section2Sub3Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section2Sub3ListItem1Title")}</strong>: {t("Section2Sub3ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub3ListItem2Title")}</strong>: {t("Section2Sub3ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section2Sub3ListItem3Title")}</strong>: {t("Section2Sub3ListItem3Desc")}
                </li>
              </ul>
            </section>

            {/* Sección 3 - Cómo usamos tu información */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section3Title")}
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section3Sub1Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section3Sub1ListItem1")}</li>
                <li>{t("Section3Sub1ListItem2")}</li>
                <li>{t("Section3Sub1ListItem3")}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section3Sub2Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section3Sub2ListItem1")}</li>
                <li>{t("Section3Sub2ListItem2")}</li>
                <li>{t("Section3Sub2ListItem3")}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section3Sub3Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section3Sub3ListItem1")}</li>
                <li>{t("Section3Sub3ListItem2")}</li>
                <li>{t("Section3Sub3ListItem3")}</li>
              </ul>
            </section>

            {/* Sección 4 - Compartición de datos */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section4Title")}
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section4Sub1Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section4Sub1ListItem1Title")}</strong>: {t("Section4Sub1ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section4Sub1ListItem2Title")}</strong>: {t("Section4Sub1ListItem2Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section4Sub2Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section4Sub2ListItem1Title")}</strong>: {t("Section4Sub2ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section4Sub2ListItem2Title")}</strong>: {t("Section4Sub2ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section4Sub2ListItem3Title")}</strong>: {t("Section4Sub2ListItem3Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section4Sub3Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section4Sub3ListItem1Title")}</strong>: {t("Section4Sub3ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section4Sub3ListItem2Title")}</strong>: {t("Section4Sub3ListItem2Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section4Sub4Title")}
              </h3>
              <p className="mb-4 text-gray-700">{t("Section4Sub4Content")}</p>
            </section>

            {/* Sección 5 - Seguridad de los datos */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section5Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section5Intro")}</p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section5ListItem1Title")}</strong>: {t("Section5ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section5ListItem2Title")}</strong>: {t("Section5ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section5ListItem3Title")}</strong>: {t("Section5ListItem3Desc")}
                </li>
              </ul>
              <p className="mb-4 text-gray-700 font-medium">
                {t("Section5SecurityNote")}{" "}
                <a href="mailto:security@toydacity.com" className="text-[#3498DB] hover:underline">
                  security@toydacity.com
                </a>.
              </p>
            </section>

            {/* Sección 6 - Tus opciones */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section6Title")}
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section6Sub1Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section6Sub1ListItem1")}</li>
                <li>{t("Section6Sub1ListItem2")}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section6Sub2Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section6Sub2ListItem1")}</li>
                <li>{t("Section6Sub2ListItem2")}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section6Sub3Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section6Sub3ListItem1Title")}</strong>:{" "}
                  <a href="https://optout.aboutads.info/"  target="_blank" rel="noopener noreferrer" className="text-[#3498DB] hover:underline">
                    {t("Section6Sub3ListItem1LinkText")}
                  </a>.
                </li>
                <li>
                  <strong>{t("Section6Sub3ListItem2Title")}</strong>: {t("Section6Sub3ListItem2Desc")}
                </li>
              </ul>
            </section>

            {/* Sección 7 - Privacidad infantil */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section7Title")}
              </h2>
              <p className="mb-3 text-gray-700">{t("Section7Intro")}</p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section7Sub1Title")}
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section7Sub1ListItem1Title")}</strong>: {t("Section7Sub1ListItem1Desc")}
              </p>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section7Sub1ListItem2Title")}</strong>: {t("Section7Sub1ListItem2Desc")}
              </p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section7Sub2Title")}
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section7Sub2ListItem1Title")}</strong>: {t("Section7Sub2ListItem1Desc")}
              </p>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section7Sub2ListItem2Title")}</strong>: {t("Section7Sub2ListItem2Desc")}
              </p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>{t("Section7Sub2ListItem2Bullet1")}</li>
                <li>{t("Section7Sub2ListItem2Bullet2")}</li>
                <li>{t("Section7Sub2ListItem2Bullet3")}</li>
              </ul>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section7Sub2ListItem3Title")}</strong>: {t("Section7Sub2ListItem3Desc")}
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>{t("Section7Sub2ListItem3Bullet1")}</li>
                <li>{t("Section7Sub2ListItem3Bullet2")}</li>
              </ul>
            </section>

            {/* Sección 8 - Transferencias internacionales */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section8Title")}
              </h2>
              <p className="mb-4 text-gray-700">{t("Section8Content")}</p>
            </section>

            {/* Sección 9 - Divulgaciones específicas por estado */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section9Title")}
              </h2>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub1Title")}
              </h3>
              <p className="mb-3 text-gray-700">
                <strong>{t("Section9Sub1IntroStrong")}</strong>
              </p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub1ListItem1Title")}</strong>: {t("Section9Sub1ListItem1Desc")}
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>{t("Section9Sub1ListItem1Sub1")}</li>
                    <li>{t("Section9Sub1ListItem1Sub2")}</li>
                    <li>{t("Section9Sub1ListItem1Sub3")}</li>
                  </ul>
                </li>
                <li>
                  <strong>{t("Section9Sub1ListItem2Title")}</strong>: {t("Section9Sub1ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub1ListItem3Title")}</strong>: {t("Section9Sub1ListItem3Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub1ListItem4Title")}</strong>: {t("Section9Sub1ListItem4Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub1ListItem5Title")}</strong>: {t("Section9Sub1ListItem5Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub1ListItem6Title")}</strong>: {t("Section9Sub1ListItem6Desc")}
                </li>
              </ul>

              <p className="mb-3 text-gray-700 font-medium">
                {t("Section9Sub1Methods")}
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  {t("Section9Sub1Method1")}{" "}
                  <a href="mailto:privacy@toydacity.com" className="text-[#3498DB] hover:underline">
                    privacy@toydacity.com
                  </a>{" "}
                  ({t("Section9Sub1Method1Extra")})
                </li>
                <li>{t("Section9Sub1Method2")}</li>
                <li>
                  <strong>{t("Section9Sub1Method3Title")}</strong>: {t("Section9Sub1Method3Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub2Title")}
              </h3>
              <p className="mb-3 text-gray-700">
                {t("Section9Sub2IntroStrong")}
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub2ListItem1Title")}</strong>: {t("Section9Sub2ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub2ListItem2Title")}</strong>: {t("Section9Sub2ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub2ListItem3Title")}</strong>: {t("Section9Sub2ListItem3Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub2ListItem4Title")}</strong>: {t("Section9Sub2ListItem4Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub3Title")}
              </h3>
              <p className="mb-3 text-gray-700">{t("Section9Sub3Intro")}</p>
              <ul className="list-disc pl-5 mb-3 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub3ListItem1Title")}</strong>: {t("Section9Sub3ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub3ListItem2Title")}</strong>: {t("Section9Sub3ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub3ListItem3Title")}</strong>: {t("Section9Sub3ListItem3Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub3ListItem4Title")}</strong>:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>{t("Section9Sub3ListItem4Bullet1")}</li>
                    <li>{t("Section9Sub3ListItem4Bullet2")}</li>
                    <li>{t("Section9Sub3ListItem4Bullet3")}</li>
                  </ul>
                </li>
              </ul>
              <p className="mb-4 text-gray-700 font-medium">
                {t("Section9Sub3Note")}
              </p>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub4Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub4ListItem1Title")}</strong>: {t("Section9Sub4ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub4ListItem2Title")}</strong>: {t("Section9Sub4ListItem2Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub4ListItem3Title")}</strong>:{" "}
                  <a href="mailto:privacy@toydacity.com" className="text-[#3498DB] hover:underline">
                    {t("Section9Sub4ListItem3Link")}
                  </a>{" "}
                  ({t("Section9Sub4ListItem3Timeframe")})
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub5Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub5ListItem1Title")}</strong>: {t("Section9Sub5ListItem1Desc")}
                </li>
                <li>
                  <strong>{t("Section9Sub5ListItem2Title")}</strong>: {t("Section9Sub5ListItem2Desc")}
                </li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-medium text-[#16A085] mt-4 mb-2">
                {t("Section9Sub6Title")}
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
                <li>
                  <strong>{t("Section9Sub6ListItem1Title")}</strong>:{" "}
                  <a href="mailto:optout@toydacity.com" className="text-[#3498DB] hover:underline">
                    optout@toydacity.com
                  </a>{" "}
                  {t("Section9Sub6ListItem1Desc")}
                </li>
              </ul>
            </section>

            {/* Sección 10 - Contáctanos */}
            <section className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#2980B9] mb-3">
                {t("Section10Title")}
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-1 text-gray-700">
                  <strong>{t("Section10Contact1")}</strong>
                </p>
                <p className="mb-1 text-gray-700">{t("Section10Contact2")}</p>
                <p className="mb-1 text-gray-700">{t("Section10Contact3")}</p>
                <p className="mb-1 text-gray-700">
                  {t("Section10Contact4")}{" "}
                  <a href="mailto:privacy@toydacity.com" className="text-[#3498DB] hover:underline">
                    privacy@toydacity.com
                  </a>
                </p>
                <p className="text-gray-700">{t("Section10Contact5")}</p>
              </div>
            </section>

            {/* Enlace adicional */}
            <div className="mt-6">
              <Link
                href="/deletedata"
                className="inline-block bg-[#3498DB] text-white px-4 py-2 rounded hover:bg-[#2980B9] transition-colors"
              >
                {t("DeleteDataLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}