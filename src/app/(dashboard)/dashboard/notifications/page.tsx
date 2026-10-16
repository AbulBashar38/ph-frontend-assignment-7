import type { Metadata } from "next";
import { Suspense } from "react";
import NotificationList, {
  NotificationListSkeleton,
} from "@/components/modules/notifications/notification-list";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeader
        title="Notifications"
        description="Everything that happened on your account. Open one to go straight to it."
      />
      {/* The list reads ?filter and ?page */}
      <Suspense fallback={<NotificationListSkeleton />}>
        <NotificationList pathname="/dashboard/notifications" />
      </Suspense>
    </div>
  );
}
