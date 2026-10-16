import type { Metadata } from "next";
import { Suspense } from "react";
import AddAdminButton from "@/components/modules/admin-users/add-admin-button";
import UserTable from "@/components/modules/admin-users/user-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Every tenant, owner and admin. Block accounts that break the rules."
        actions={<AddAdminButton />}
      />
      {/* The table reads ?role, ?status, ?searchTerm and ?page */}
      <Suspense fallback={<TableSkeleton />}>
        <UserTable />
      </Suspense>
    </div>
  );
}
