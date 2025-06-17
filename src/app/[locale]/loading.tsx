import SkeletonProductCard from "@/components/shared/SkeletonProductCard";

const count = 8;

export default function loading() {
  return (
    <main>
        <div className="w-full h-[253px]">

        </div>
      <div className="mx-auto max-w-7xl px-1 pb-6 md:px-16 lg:px-8 mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array(count)
            .fill(0)
            .map((_, index) => (
              <SkeletonProductCard key={index} />
            ))}
        </div>
      </div>
    </main>
  );
}
