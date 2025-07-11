import Breadcrumbs from "@/components/shared/BreadCrumbs";
import CreatePostForm from "@/components/shared/post/CreatePostForm";
import Sigin from "@/components/shared/Sigin";
import { getCategories } from "@/lib/actions/categoriesAction";
import { getConditions } from "@/lib/actions/conditionActions";
import { getStatuses } from "@/lib/actions/statusActions";
import { auth } from "@clerk/nextjs/server";

export default async function PostPage() {
  const categories = await getCategories();
  const condition = await getConditions();
  const statuses = await getStatuses();
  const { userId } = await auth();

  return (
    <div>
      {userId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />
          <CreatePostForm
            categories={categories}
            conditions={{ data: condition }}
            statuses={statuses}
          />
        </div>
      ) : (
        <Sigin />
      )}
    </div>
  );
}
