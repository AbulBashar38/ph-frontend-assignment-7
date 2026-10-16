import type { Metadata } from "next";
import { Suspense } from "react";
import RoommateProfileView, {
  RoommateProfileViewSkeleton,
} from "@/components/modules/roommate/roommate-profile-view";

export const metadata: Metadata = {
  title: "Roommate profile",
  robots: { index: false },
};

// The id is only known per request, so the profile streams in behind a skeleton
export default function Page({
  params,
}: PageProps<"/dashboard/roommate/profile/[id]">) {
  return (
    <Suspense fallback={<RoommateProfileViewSkeleton />}>
      {params.then(({ id }) => (
        <RoommateProfileView id={id} />
      ))}
    </Suspense>
  );
}
