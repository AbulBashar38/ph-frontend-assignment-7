import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-14 w-4/5 max-w-lg" />
          <Skeleton className="h-5 w-full max-w-md" />
          <Skeleton className="mt-8 h-16 w-full max-w-2xl rounded-full" />
        </div>
        <Skeleton className="aspect-[5/6] w-full max-w-md rounded-[2rem] lg:max-w-none" />
      </div>

      <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["a", "b", "c"].map((key) => (
          <div key={key} className="overflow-hidden rounded-2xl border">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
