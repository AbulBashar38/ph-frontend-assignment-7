import type { Metadata } from "next";
import OwnerEarnings from "@/components/modules/earnings/owner-earnings";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Earnings",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Earnings"
        description="Rent collected, what's still owed and how full your rooms are."
      />
      <OwnerEarnings />
    </div>
  );
}
