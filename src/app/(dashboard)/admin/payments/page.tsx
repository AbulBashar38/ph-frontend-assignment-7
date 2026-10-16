import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentTable from "@/components/modules/payments/payment-table";
import DashboardPageHeader from "@/components/shared/dashboard-page-header";
import TableSkeleton from "@/components/shared/table-skeleton";

export const metadata: Metadata = {
  title: "Payments",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payments"
        description="Every rent bill and its Stripe payment status."
      />
      <Suspense fallback={<TableSkeleton />}>
        <PaymentTable pathname="/admin/payments" />
      </Suspense>
    </div>
  );
}
