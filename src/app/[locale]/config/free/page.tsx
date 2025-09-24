import Breadcrumbs from "@/components/shared/BreadCrumbs";
import FreeInfo from "@/components/shared/profile/FreeInfo";
import { getFree } from "@/lib/actions/toysAction";


const RegalosPage = async() => {
    const free = await getFree()
    return (
      <div className="max-w-7xl mx-auto min-h-screen bg-background">
        <div className="px-5 py-3">
          <Breadcrumbs />
        </div>
        <FreeInfo free={free}  />
      </div>
    );
};

export default RegalosPage

