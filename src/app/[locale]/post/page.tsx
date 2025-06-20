import CreatePostForm from '@/components/shared/post/CreatePostForm'
import Sigin from '@/components/shared/Sigin';
import { getCategories } from '@/lib/actions/categoriesAction';
import { getConditions } from '@/lib/actions/conditionActions';
import { getStatuses } from '@/lib/actions/statusActions';
import { getAuthUserFromRequest } from "@/lib/auth";

const PostPage = async (request: Request) => {
  const categories = await getCategories();
  const condition = await getConditions();
  const statuses = await getStatuses();
  const { success } = await getAuthUserFromRequest(request);

  return (
    <div>
      {success ? (
        <CreatePostForm categories={categories} conditions={condition} statuses={statuses}/>
      ) : (
        <Sigin />
      )}      
    </div>
  )
}

export default PostPage