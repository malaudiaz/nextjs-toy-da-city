"use client";

import { useState } from "react";
import SellerPromptCard from "@/components/shared/SellerPromptCard";
import CreatePostForm from "@/components/shared/post/CreatePostForm";
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";

type Status = {
  id: number;
  name?: string;
  description?: string;
  isActive: boolean;
};

type Category = {
  id: number;
  name?: string;
  description?: string;
  isActive: boolean;
};

type Condition = {
  id: number;
  name?: string;
  description?: string;
  isActive: boolean;
};

type Props = {
  categories: { data: Category[] };
  conditions: { data: Condition[] };
  statuses: { data: Status[] };
  rolle: string | null;
};

export default function PostPageClient({ categories, conditions, statuses, rolle }: Props) {
  const [showContent, setShowContent] = useState(rolle === "seller");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TitleBreakcrumbs translationScope="breadcrumbs" titleKey="Post" />

      {!showContent ? (
        <SellerPromptCard onNo={() => setShowContent(true)} />
      ) : (
        <CreatePostForm
          categories={categories}
          conditions={conditions}
          statuses={statuses}
          rolle={rolle ?? undefined}
        />
      )}
    </div>
  );
}
