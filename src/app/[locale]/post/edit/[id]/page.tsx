// app/post/edit/[id]/page.jsx
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import EditPostForm from "@/components/shared/post/EditPostForm";
import Sigin from "@/components/shared/Sigin";
import { getToyById } from "@/lib/actions/toysAction";
import { getCategories } from "@/lib/actions/categoriesAction";
import { getConditions } from "@/lib/actions/conditionActions";
import { getSellerData } from "@/lib/actions/sellertActions";
import { auth } from "@clerk/nextjs/server";
import { getStatuses } from "@/lib/actions/statusActions";

type PageProps = {
  params: Promise<{ id: string, locale: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) return <Sigin />;

  const { id, locale } = await params;

  const sellerData = await getSellerData(userId);
  if (sellerData.role !== "seller") {
    redirect(`/${locale}/seller-onboarding`);
  }

  const toyId = id;
  const toy = await getToyById(toyId, locale); // ← Verifica que el juguete pertenezca al vendedor

  if (!toy) {
    redirect(`/${locale}/post`);
  }

  const categories = await getCategories();
  const conditions = await getConditions();
  const statuses = await getStatuses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />
      <EditPostForm
        toy={toy}
        categories={categories}
        conditions={{ data: conditions }}
        statuses={{data: statuses}}
      />
    </div>
  );
}