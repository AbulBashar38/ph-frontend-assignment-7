import type { Metadata } from "next";
import TenantOverview from "@/components/modules/overview/tenant-overview";

export const metadata: Metadata = {
  title: "My activity",
  robots: { index: false },
};

export default function Page() {
  return <TenantOverview />;
}
