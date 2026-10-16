import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentCancel from "@/components/modules/payment-result/payment-cancel";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

// Reads ?payment_id from Stripe's redirect
export default function Page() {
  return (
    <div className="py-6 sm:py-12">
      <Suspense
        fallback={<Skeleton className="mx-auto h-96 max-w-lg rounded-3xl" />}
      >
        <PaymentCancel />
      </Suspense>
    </div>
  );
}
