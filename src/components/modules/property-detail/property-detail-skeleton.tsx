import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Skeleton className="aspect-[16/10] w-full rounded-3xl sm:aspect-[16/9]" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-8 h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    </div>
  );
}
