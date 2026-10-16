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
        description="Every rental application across the platform."
      />
      <Suspense fallback={<TableSkeleton />}>
        <ApplicationTable pathname="/admin/applications" />
      </Suspense>
    </div>
  );
}
