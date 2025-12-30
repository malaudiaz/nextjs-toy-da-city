// app/post/page.tsx
import Sigin from "@/components/shared/Sigin";
import { getCategories } from "@/lib/actions/categoriesAction";
import { getConditions } from "@/lib/actions/conditionActions";
import { getSellerData } from "@/lib/actions/sellertActions";
import { auth } from "@clerk/nextjs/server";
import { getStatuses } from "@/lib/actions/statusActions";
import PostPageClient from "@/components/shared/post/PostPageClient";

export default async function PostPage() {
  const { userId } = await auth();
  if (!userId) {
    return <Sigin />;
  }

  const sellerData = await getSellerData(userId);

  const categories = await getCategories();
  const condition = await getConditions();
  const statuses = await getStatuses();

  return (
    <div>
      <PostPageClient
        categories={categories}
        conditions={{ data: condition }}
        statuses={{ data: statuses }}
        rolle={sellerData.role}
      />
    </div>
  );
}