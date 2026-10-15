import { Skeleton } from "@/components/ui/skeleton";

// Placeholder grid shown while search results load
export default function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, index) => `card-${index}`).map(
          (key) => (
            <div key={key} className="overflow-hidden rounded-2xl border">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
