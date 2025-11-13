// app/[locale]/auth-error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useLocale } from "next-intl"; // ✅ Importa useLocale

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const clerkId = searchParams.get("clerkId");
  const t = useTranslations("auth");
  const { user, isLoaded } = useUser();
  const locale = useLocale(); // ✅ Obtiene el locale actual (ej. 'es', 'en')

  const getErrorMessage = () => {
    switch (reason) {
      case "user_not_authenticated":
        return {
          title: t("userNotAuthenticatedTitle"),
          description: t("userNotAuthenticatedDescription"),
          action: "login",
        };
      case "user_not_in_database":
        return {
          title: t("userNotFoundTitle"),
          description: t("userNotFoundDescription"),
          action: "contact_support",
        };
      case "database_error":
        return {
          title: t("databaseErrorTitle"),
          description: t("databaseErrorDescription"),
          action: "contact_support",
        };
      default:
        return {
          title: t("genericErrorTitle"),
          description: t("genericErrorDescription"),
          action: "retry",
        };
    }
  };

  const errorInfo = getErrorMessage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t("loadig")}...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {/* Icono de error */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>

          <p className="text-gray-600 mb-6">{errorInfo.description}</p>

          {/* Información de debug (solo en desarrollo) */}
          {process.env.NODE_ENV === "development" && clerkId && (
            <div className="mb-4 p-3 bg-yellow-50 rounded text-sm">
              <p className="text-yellow-800">
                <strong>Debug Info:</strong> Clerk ID: {clerkId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {user && (
              <>
                <p className="text-sm text-gray-500">
                  {t("loggedInAs")}:{" "}
                  <strong>{user.primaryEmailAddress?.emailAddress}</strong>
                </p>

                <div className="flex flex-col gap-2 pt-4">
                  {errorInfo.action === "login" ? (
                    <SignInButton
                      mode="modal"
                      forceRedirectUrl={`/${locale}/auth-callback?from=signin`}
                    >
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        {t("signIn")}
                      </button>
                    </SignInButton>
                  ) : (
                    <SignUpButton
                      mode="modal"
                      forceRedirectUrl={`/${locale}/auth-callback?from=registration`}
                    >
                      <button className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        {t("signOut")}
                      </button>
                    </SignUpButton>
                  )}

                  {errorInfo.action === "retry" && (
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      {t("retry")}
                    </button>
                  )}
                </div>
              </>
            )}

            {errorInfo.action === "contact_support" && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {t("contactSupportMessage")}
                </p>
                <a
                  href="mailto:support@tudominio.com"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  {t("contactSupport")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
