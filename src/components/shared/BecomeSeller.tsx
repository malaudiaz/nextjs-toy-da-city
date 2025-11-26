"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useLocale } from "next-intl"; // ✅ Importa useLocale
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const BecomeSeller = () => {
  const t = useTranslations("sellerOnboarding");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const locale = useLocale(); // ✅ Obtiene el locale actual (ej. 'es', 'en')
  const router = useRouter();

  const handleBecomeSeller = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch(`/${locale}/api/stripe-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        router.push(`/${locale}/auth-error?reason=database_error`);
        return;
      }

      const data = await response.json();
      window.location.href = data.onboardingUrl;
    } catch (error) {
      console.error(t("error"), error);
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("BecomeSeller")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            {t("BecomeSellerDescription")}
          </p>

          <button
            onClick={handleBecomeSeller}
            disabled={loading}
            className="w-full bg-[#4c754b] text-white py-2 rounded hover:bg-[#558d54]"
          >
            {loading ? t("processing") : t("StartSelling")}
          </button>
        </CardContent>
      </Card>
  );
};
export default BecomeSeller;