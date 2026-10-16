import type { Metadata } from "next";
import RoommateProfileManager from "@/components/modules/roommate/roommate-profile-manager";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Roommate profile",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DashboardPageHeader
        title="Roommate profile"
        description="What you're looking for and how you live. Matches are scored from this."
      />
      <RoommateProfileManager />
    </div>
  );
}
