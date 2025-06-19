import RegalosInfo from "@/components/shared/profile/RegalosInfo";
import { products } from "../ventas/page";
import Breadcrumbs from "@/components/shared/BreadCrumbs";

const RegalosPage = () => {
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">
         <Breadcrumbs/>
        <h1 className="text-lg font-bold">Your Gifts</h1>
      </div>

      <RegalosInfo produts={products} />
    </div>
  );
};

export default RegalosPage;
