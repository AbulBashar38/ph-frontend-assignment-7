import type { Metadata } from "next";
import ProfileSettings from "@/components/modules/profile/profile-settings";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Profile & settings",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title="Profile & settings"
        description="Your photo, contact details and password."
      />
      <ProfileSettings />
    </div>
  );
}
