"use client";

import Sigin from "@/components/shared/Sigin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import useSWR from "swr";
import { useLocale } from "next-intl"; // ✅ Importa useLocale
import { useTranslations } from "next-intl";

const fetcher = (...args:Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function SellerDashboard() {
  const t = useTranslations("sellerInfo");
  const { user, isLoaded } = useUser();
  const locale = useLocale(); // ✅ Obtiene el locale actual (ej. 'es', 'en')
  const {data} = useSWR(`/api/users/${user?.id}/validate-seller`, fetcher);

  return (
    <>
      {user ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {t("dashboard")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center justify-center text-center">
              {!isLoaded ? (
                <p>{t("loading")}</p>
              ) : data.stripeAccountId ? (
                <p>{t("stripeAccountOk")}</p>
              ) : (
                <p>{t("onBoardingError")}</p>
              )}

              <Link href={`/${locale}`}
                className="inline-flex items-center justify-center rounded-md bg-[#4c754b] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#558d54] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
              >
                <p>{t("backHome")}</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Sigin />
      )}
    </>
  );
}
