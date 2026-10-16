import type { Metadata } from "next";
import AdminOverview from "@/components/modules/overview/admin-overview";

export const metadata: Metadata = {
  title: "Platform analytics",
  robots: { index: false },
};

export default function Page() {
  return <AdminOverview />;
}
