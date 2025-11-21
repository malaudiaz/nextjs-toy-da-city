import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import CreatePostSkeleton from "@/components/shared/post/CreatePostSkeleton";

// Definición de tipo para el componente Loading (aunque en este caso es un componente sin props)
// Esto es opcional, ya que el tipo inferido es React.FC
const Loading: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TitleBreakcrumbs translationScope="breadcrumbs" titleKey="Post" />
      <CreatePostSkeleton />
    </div>
  );
};

export default Loading;
