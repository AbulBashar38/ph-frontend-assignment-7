"use client";

import { CircleCheck, Receipt, SearchX, Undo2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment, useUrlState } from "@/hooks";
import { PAYABLE_STATUSES } from "@/types";
import { getErrorMessage } from "@/utils";
import PayButton from "../payments/pay-button";
import BillSummary from "./bill-summary";
import ResultCard from "./result-card";

const paymentsLink = (
  <Link
    href="/dashboard/payments"
    className={buttonVariants({ variant: "outline" })}
  >
    <Receipt />
    All payments
  </Link>
);

// Left Stripe Checkout without paying: nothing was charged, offer to try again
export default function PaymentCancel() {
  const { get } = useUrlState();
  const paymentId = get("payment_id") || null;
  const query = usePayment(paymentId);

  if (!paymentId || query.isError) {
    return (
      <ResultCard
        icon={SearchX}
        tone="muted"
        title="Payment cancelled"
        description={
          query.isError
            ? getErrorMessage(query.error)
            : "No money was taken. Your bills are in your payments list."
        }
        actions={paymentsLink}
      />
    );
  }

  if (query.isPending) {
    return (
      <ResultCard
        icon={Undo2}
        tone="muted"
        title="Payment cancelled"
        description="No money was taken."
      >
        <Skeleton className="h-40 w-full rounded-2xl" />
      </ResultCard>
    );
  }

  const payment = query.data.data;

  // Paid after all (e.g. in another tab)
  if (payment.status === "PAID") {
    return (
      <ResultCard
        icon={CircleCheck}
        tone="success"
        title="This bill is already paid"
        description="Nothing more to do here."
        actions={paymentsLink}
      >
        <BillSummary payment={payment} />
      </ResultCard>
    );
  }

  const canRetry =
    PAYABLE_STATUSES.includes(payment.status) &&
    (payment.rental.status === "PENDING" || payment.rental.status === "ACTIVE");

  return (
    <ResultCard
      icon={Undo2}
      tone="muted"
      title="Payment cancelled"
      description="You left the checkout, so no money was taken. The bill is still open whenever you're ready."
      actions={
        <>
          {paymentsLink}
          {canRetry && <PayButton payment={payment} size="default" />}
        </>
      }
    >
      <BillSummary payment={payment} />
    </ResultCard>
  );
}
