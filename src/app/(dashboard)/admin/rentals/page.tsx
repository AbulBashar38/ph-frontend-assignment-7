import type { Metadata } from "next";
import { Suspense } from "react";
import RentalTable from "@/components/modules/rentals/rental-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Rentals",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Rentals"
        description="Every rental across the platform."
      />
      <Suspense fallback={<TableSkeleton />}>
        <RentalTable pathname="/admin/rentals" />
      </Suspense>
    </div>
  );
}
