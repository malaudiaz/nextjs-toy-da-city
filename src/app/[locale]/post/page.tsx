import CreatePostForm from '@/components/shared/post/CreatePostForm'
import Sigin from '@/components/shared/Sigin';
import { getCategories } from '@/lib/actions/categoriesAction';
import { getConditions } from '@/lib/actions/statusActions';
import { getAuthUserFromRequest } from "@/lib/auth";

const PostPage = async (request: Request) => {
  const categories = await getCategories();
  const condition = await getConditions();
  const { success, userId, error, code } = await getAuthUserFromRequest(request);

  console.log(success, userId, error, code);

  return (
    <div>
      {success ? (
        <CreatePostForm categories={categories} conditions={condition}/>        
      ) : (
        <Sigin />
      )}      
    </div>
  )
}

export default PostPage
