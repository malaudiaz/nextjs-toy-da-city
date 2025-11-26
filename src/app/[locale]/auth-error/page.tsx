// app/[locale]/auth-error/page.tsx
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import AuthError from "@/components/shared/auth/AuthError";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const clerkId = searchParams.get("clerkId");
  const { user, isLoaded } = useUser();
  const t = useTranslations("auth");
  

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
        {user && (
          <AuthError reason={reason || ""} clerkId={clerkId || ""} user={user} />
        )}
      </div>
    </div>
  );
}
