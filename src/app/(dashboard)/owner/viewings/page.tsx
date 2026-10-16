import type { Metadata } from "next";
import { Suspense } from "react";
import ViewingTable from "@/components/modules/viewings/viewing-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Viewing requests",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Viewing requests"
        description="Approve, move or decline the times tenants ask to see your places."
      />
      {/* The table reads ?status, ?propertyId, ?sort and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <ViewingTable pathname="/owner/viewings" />
      </Suspense>
    </div>
  );
}
