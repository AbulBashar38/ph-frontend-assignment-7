import type { Metadata } from "next";
import { Suspense } from "react";
import ApplicationTable from "@/components/modules/applications/application-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "My applications",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My applications"
        description="Rooms you applied for. Once approved, the room is held for you until the first rent is paid."
      />
      {/* The table reads ?status, ?sort and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <ApplicationTable pathname="/dashboard/applications" />
      </Suspense>
    </div>
  );
}
