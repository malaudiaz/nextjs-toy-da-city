import RegalosInfo from "@/components/shared/profile/RegalosInfo";
import { products } from "../ventas/page";

const RegalosPage = () => {
  return (
    <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-bold">Tus Regalos</h1>
      </div>

      <RegalosInfo produts={products} />
    </div>
  );
};

export default RegalosPage;
