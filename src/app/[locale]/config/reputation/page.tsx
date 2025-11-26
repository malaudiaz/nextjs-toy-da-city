// app/profile/my-reviews/page.tsx

import { useUser } from "@clerk/nextjs";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import ViewReputation from "@/components/shared/ViewReputation";

export default function MyReviewsPage() {
  const { user: clerkUser } = useUser();

  if (!clerkUser) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold">{}</h2>
        <p className="mt-2 text-gray-600">{}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config"/>
        <Breadcrumbs className="md:hidden"/>
      </div>

      <ViewReputation />
    </div>
  );
}
