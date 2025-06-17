import CreatePostForm from '@/components/shared/post/CreatePostForm'
import { getCategories } from '@/lib/actions/categoriesAction';
import { getConditions } from '@/lib/actions/statusActions';
import React from 'react'

const PostPage = async () => {
  const categories = await getCategories();
  const condition = await getConditions();

  return (
    <div>
      <CreatePostForm categories={categories} conditions={condition}/>
    </div>
  )
}

export default PostPage
