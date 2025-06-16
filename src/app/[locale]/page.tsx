import BannerCarousel from "@/components/shared/banner/BannerCarousel";
import Products from "@/components/shared/home/Products";
import { getToys } from "@/lib/actions/toysAction";

export default async function Home() {
  const toys = await getToys();

  return (
    <>
      <BannerCarousel />
      <Products toys={toys} />
    </>
  );
}
