import type { Metadata } from "next";
import { Suspense } from "react";
import ViewingTable from "@/components/modules/viewings/viewing-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "My viewings",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My viewings"
        description="Times you asked to see a place, and what the owners said."
      />
      {/* The table reads ?status, ?sort and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <ViewingTable pathname="/dashboard/viewings" />
      </Suspense>
    </div>
  );
}
