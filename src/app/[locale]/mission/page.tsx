import Breadcrumbs from "@/components/shared/BreadCrumbs";
import React from "react";
import { getTranslations } from "next-intl/server";

const MissionPage = async () => {
  const t = await getTranslations("mission"); 

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

            {/* Contenido */}
            <section className="mt-4">
              <p className="mb-4 text-gray-700">
                {t("subtitle")}
              </p>
              <p className="mb-4 text-gray-700">
                {t("content")}
              </p>
              <p className="mb-4 text-gray-700">
                {t("more")}
              </p>
              <p className="text-gray-700">
                {t("commitment")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;