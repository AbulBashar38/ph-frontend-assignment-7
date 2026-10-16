import type { Metadata } from "next";
import { Suspense } from "react";
import ApplicationTable from "@/components/modules/applications/application-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Applications"
        description="Review who wants to rent your rooms. Approving reserves the room until the first rent is paid."
      />
      {/* The table reads ?status, ?propertyId, ?sort and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <ApplicationTable pathname="/owner/applications" />
      </Suspense>
    </div>
  );
}
