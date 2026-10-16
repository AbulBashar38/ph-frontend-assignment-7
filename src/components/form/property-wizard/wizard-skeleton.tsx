import { Skeleton } from "@/components/ui/skeleton";

export default function WizardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-10 w-full rounded-full" />
      <div className="space-y-6 rounded-3xl border bg-card p-5 sm:p-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-72 max-w-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c"].map((key) => (
            <Skeleton key={key} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>
    </div>
  );
}
