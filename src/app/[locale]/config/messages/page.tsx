import MessageInfo from "@/components/shared/profile/Messagesinfo";
import MessageInfoSkeleton from "@/components/shared/profile/MessageInfoSkeleton";
import React, { Suspense } from "react";
import { getMessages } from "@/lib/actions/toysAction";
import Breadcrumbs from "@/components/shared/BreadCrumbs";
import { Messages } from "@/types/modelTypes";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

const MessagesContent = async ({ messages }: { messages: Messages[] }) => {
  return <MessageInfo messages={messages} />;
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const MessagesPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams.page as string) || "1");
  const postsPerPage = parseInt(
    (resolvedSearchParams.pageSize as string) ||
      process.env.NEXT_TOYS_PER_PAGE ||
      "8"
  );
  const { messages, totalPosts, totalPages } = await getMessages(currentPage, postsPerPage);

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <Breadcrumbs className="hidden md:block" ignoreSegment="config" />
        <Breadcrumbs className="md:hidden" />
      </div>

      <Suspense fallback={<MessageInfoSkeleton />}>
        <MessagesContent messages={messages} />
      </Suspense>
      {totalPages > 1 && (
        <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPosts}
        />
      )}
    </div>
  );
};

export default MessagesPage;
