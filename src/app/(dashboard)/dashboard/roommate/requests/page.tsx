import type { Metadata } from "next";
import { Suspense } from "react";
import RequestList, {
  RequestListSkeleton,
} from "@/components/modules/roommate/request-list";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Roommate requests",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DashboardPageHeader
        title="Roommate requests"
        description="Answer the tenants who want to connect, and follow the ones you asked."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <RequestList />
      </Suspense>
    </div>
  );
}
