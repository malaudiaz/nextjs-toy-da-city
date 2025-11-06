import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

const SearchLayout = ({ children }: Props) => {
  return (
    <div className="bg-[#FBFAF4]">
      <BannerCarousel />
      {children}
    </div>
  );
};

export default SearchLayout;
