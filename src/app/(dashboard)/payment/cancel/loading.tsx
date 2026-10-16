import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6 sm:py-12">
      <Skeleton className="mx-auto h-96 max-w-lg rounded-3xl" />
    </div>
  );
}
