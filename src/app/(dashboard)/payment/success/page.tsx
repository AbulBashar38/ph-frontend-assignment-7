import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccess from "@/components/modules/payment-result/payment-success";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false },
};

// Reads ?session_id from Stripe's redirect
export default function Page() {
  return (
    <div className="py-6 sm:py-12">
      <Suspense
        fallback={<Skeleton className="mx-auto h-96 max-w-lg rounded-3xl" />}
      >
        <PaymentSuccess />
      </Suspense>
    </div>
  );
}
