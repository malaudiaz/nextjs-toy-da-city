"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl"; // ✅

const AuthCallBack = () => {
  const locale = useLocale(); // ✅ Siempre actualizado
  const t = useTranslations("auth-callback");

  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "prompt" | "redirecting">(
    "loading"
  );
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push(`/${locale}/sign-in`);
      return;
    }

    const checkUser = async () => {
      // Detecta ambos proveedores
      const hasGoogleOAuth = user.externalAccounts.some(
        (account) => account.provider === "google"
      );
      const hasFacebookOAuth = user.externalAccounts.some(
        (account) => account.provider === "facebook"
      );

      const hasPhoneNumber = user.phoneNumbers.length > 0;
      const fromRegistration = searchParams.get("from") === "registration";

      // Solo mostrar prompt si viene del registro con Google y no tiene teléfono
      if ((fromRegistration || (hasGoogleOAuth || hasFacebookOAuth)) && !hasPhoneNumber) {
        setStatus("prompt");
        setShowPrompt(true);
      } else {
        // Redirigir al home si ya tiene teléfono o no es necesario
        router.push(`/${locale}`);
      }
    };

    checkUser();
  }, [isLoaded, user, router, searchParams, locale]);

  const handleYes = () => {
    setStatus("redirecting");
    setShowPrompt(false);
    openUserProfile({
      appearance: {
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg",
        },
      },
    });
  };

  const handleNo = () => {
    setShowPrompt(false);
    router.push(`/${locale}`);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (status === "redirecting") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t("redirecting")}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div>
      {showPrompt && (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-gray-200">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("message")}
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-6">
                {t("question")}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNo}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {t("btnNo")}
            </button>
            <button
              onClick={handleYes}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {t("btnYes")}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t("note")}
          </p>
        </div>
      )}
    </div>
  );
}

export default AuthCallBack;