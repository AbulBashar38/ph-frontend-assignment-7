import type { Metadata } from "next";
import { Suspense } from "react";
import ModerationTable from "@/components/modules/admin-properties/moderation-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Listings",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Listings"
        description="Every property on the platform. Suspend listings that break the rules."
      />
      <Suspense fallback={<TableSkeleton />}>
        <ModerationTable />
      </Suspense>
    </div>
  );
}
