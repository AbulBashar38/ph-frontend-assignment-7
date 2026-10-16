import type { Metadata } from "next";
import { Suspense } from "react";
import MatchList, {
  MatchListSkeleton,
} from "@/components/modules/roommate/match-list";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Roommate matches",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Roommate matches"
        description="Tenants looking for a roommate, best fits first."
      />
      {/* The list reads ?minScore and ?page */}
      <Suspense fallback={<MatchListSkeleton />}>
        <MatchList />
      </Suspense>
    </div>
  );
}
