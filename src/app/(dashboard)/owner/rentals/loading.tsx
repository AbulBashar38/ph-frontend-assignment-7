import TableSkeleton from "@/components/shared/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
}
