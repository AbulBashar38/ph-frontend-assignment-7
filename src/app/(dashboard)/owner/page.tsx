import type { Metadata } from "next";
import OwnerOverview from "@/components/modules/overview/owner-overview";

export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false },
};

export default function Page() {
  return <OwnerOverview />;
}
