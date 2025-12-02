import Breadcrumbs from "@/components/shared/BreadCrumbs";
import ViewReputation from "@/components/shared/ViewReputation";

export default function MyReviewsPage() {
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
