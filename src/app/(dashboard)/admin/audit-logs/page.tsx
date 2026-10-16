import type { Metadata } from "next";
import { Suspense } from "react";
import AuditTable from "@/components/modules/audit/audit-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Audit logs",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Audit logs"
        description="Who changed what, and when: moderation, bookings, rentals and payments."
      />
      {/* The table reads ?resource, ?action, ?actorRole and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <AuditTable />
      </Suspense>
    </div>
  );
}
