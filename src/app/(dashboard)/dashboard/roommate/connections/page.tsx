import type { Metadata } from "next";
import { Suspense } from "react";
import ConnectionList, {
  ConnectionListSkeleton,
} from "@/components/modules/roommate/connection-list";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Connections",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DashboardPageHeader
        title="Connections"
        description="Tenants you're connected with. Reach out to plan a place together."
      />
      <Suspense fallback={<ConnectionListSkeleton />}>
        <ConnectionList />
      </Suspense>
    </div>
  );
}
