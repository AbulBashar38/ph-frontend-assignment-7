import type { Metadata } from "next";
import ShortlistCompare from "@/components/modules/shortlist/shortlist-compare";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Shortlist",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Shortlist"
        description="Places you saved, side by side: rent, rooms, dates and amenities."
      />
      <ShortlistCompare />
    </div>
  );
}
