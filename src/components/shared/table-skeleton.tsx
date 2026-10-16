import { Skeleton } from "@/components/ui/skeleton";

// Placeholder for a toolbar + DataTable while the list loads
export default function TableSkeleton({
  rows = 5,
  toolbar = true,
}: {
  rows?: number;
  toolbar?: boolean;
}) {
  return (
    <div className="space-y-4">
      {toolbar && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-12 w-full max-w-md rounded-xl" />
          <Skeleton className="h-12 w-full max-w-lg rounded-xl" />
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Skeleton className="h-11 rounded-none" />
        {Array.from({ length: rows }, (_, index) => `row-${index}`).map(
          (key) => (
            <div key={key} className="flex items-center gap-4 border-t p-4">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
              <Skeleton className="size-10 rounded-lg" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
