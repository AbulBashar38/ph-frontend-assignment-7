import { Skeleton } from "@/components/ui/skeleton";

// Placeholder while a client-side auth form loads
export default function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: fields }, (_, index) => `field-${index}`).map(
        (key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
        ),
      )}
      <Skeleton className="h-14 w-full" />
    </div>
  );
}
