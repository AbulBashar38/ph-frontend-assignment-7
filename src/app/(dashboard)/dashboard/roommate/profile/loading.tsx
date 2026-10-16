import { RoommateProfileSkeleton } from "@/components/modules/roommate/roommate-profile-manager";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <RoommateProfileSkeleton />
    </div>
  );
}
