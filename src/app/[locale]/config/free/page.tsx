import Breadcrumbs from "@/components/shared/BreadCrumbs";
import FreeInfo from "@/components/shared/profile/FreeInfo";
import { getFree } from "@/lib/actions/toysAction";


const RegalosPage = async() => {
    const free = await getFree()
    return (
      <div>
        <div className="px-5 py-3 md:hidden ">
          <Breadcrumbs />
        </div>
        <FreeInfo free={free}  />
      </div>
    );
};

export default RegalosPage

