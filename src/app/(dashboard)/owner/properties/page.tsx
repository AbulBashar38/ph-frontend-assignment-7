import { PlusSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import PropertyTable from "@/components/modules/owner-properties/property-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My properties",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My properties"
        description="Edit listings, manage rooms and photos, and choose what's live."
        actions={
          <Link href="/owner/properties/new" className={buttonVariants()}>
            <PlusSquare />
            Add property
          </Link>
        }
      />
      {/* The table reads ?searchTerm, ?status and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <PropertyTable />
      </Suspense>
    </div>
  );
}
