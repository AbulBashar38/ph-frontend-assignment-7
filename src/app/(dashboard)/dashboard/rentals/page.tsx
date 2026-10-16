import type { Metadata } from "next";
import { Suspense } from "react";
import RentalTable from "@/components/modules/rentals/rental-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "My rentals",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My rentals"
        description="Where you live, and the places you've rented before."
      />
      {/* The table reads ?status, ?sort and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <RentalTable pathname="/dashboard/rentals" />
      </Suspense>
    </div>
  );
}
