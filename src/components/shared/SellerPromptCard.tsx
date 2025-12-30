// components/shared/SellerPromptCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

type SellerPromptCardProps = {
  onNo?: () => void;
  onYes?: () => void;
};

export default function SellerPromptCard({ onNo, onYes }: SellerPromptCardProps) {
  const t = useTranslations("SellerPromptCard");
  const router = useRouter();
  const locale = useLocale(); // next-intl devuelve un string

  const handleBecomeSeller = () => {
    if (onYes) return onYes();
    router.push(`/${locale}/seller-onboarding`);
  };

  const handleStay = () => {
    if (onNo) return onNo();
    router.push(`/${locale}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBecomeSeller}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            type="button"
          >
            {t("btnYes")}
          </button>
          <button
            onClick={handleStay}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            type="button"
          >
            {t("btnNo")}
          </button>
        </div>
      </div>
    </div>
  );
}