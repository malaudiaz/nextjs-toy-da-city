// app/post/page.jsx
import { redirect } from "next/navigation"; // Importa redirect
import CreatePostForm from "@/components/shared/post/CreatePostForm";
import Sigin from "@/components/shared/Sigin";
import { getCategories } from "@/lib/actions/categoriesAction";
import { getConditions } from "@/lib/actions/conditionActions";
import { getSellerData } from "@/lib/actions/sellertActions";
import { auth } from "@clerk/nextjs/server";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import { getStatuses } from "@/lib/actions/statusActions";

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return <Sigin />;

  const sellerData = await getSellerData(userId);

  const { locale } = await params; // ✅ Así obtienes el locale en un Server Component

  if (sellerData.role !== "seller") {
    redirect(`/${locale}/seller-onboarding`);
  }

  const categories = await getCategories();
  const condition = await getConditions();
  const statuses = await getStatuses();

  return (
    <div>
      {userId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TitleBreakcrumbs translationScope="breadcrumbs" titleKey="Post" />
          <CreatePostForm
            categories={categories}
            conditions={{ data: condition }}
            statuses={{ data: statuses }}
          />
        </div>
      ) : (
        <Sigin />
      )}
    </div>
  );
}
