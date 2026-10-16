import { Skeleton } from "@/components/ui/skeleton";

// Loading and empty states shared by the overview lists
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => `row-${index}`).map((key) => (
        <Skeleton key={key} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>
  );
}
