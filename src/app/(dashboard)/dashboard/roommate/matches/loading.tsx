import { MatchListSkeleton } from "@/components/modules/roommate/match-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <MatchListSkeleton />
    </div>
  );
}
