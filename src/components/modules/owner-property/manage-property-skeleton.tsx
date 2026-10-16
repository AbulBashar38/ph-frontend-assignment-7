import { Skeleton } from "@/components/ui/skeleton";

export default function ManagePropertySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
      <Skeleton className="h-12 w-80 max-w-full rounded-xl" />
      <div className="space-y-5 rounded-2xl border bg-card p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          {["a", "b", "c"].map((key) => (
            <Skeleton key={key} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>
    </div>
  );
}
