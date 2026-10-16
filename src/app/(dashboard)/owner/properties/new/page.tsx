import type { Metadata } from "next";
import PropertyWizard from "@/components/form/property-wizard";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";

export const metadata: Metadata = {
  title: "Add property",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <DashboardPageHeader
        title="Add a property"
        description="Six short steps. Your progress is saved in this tab, so you can come back to it."
      />
      <PropertyWizard />
    </div>
  );
}
