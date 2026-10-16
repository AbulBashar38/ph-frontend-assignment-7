"use client";

import {
  CircleAlert,
  CircleCheck,
  Hourglass,
  Receipt,
  SearchX,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { usePaymentBySession, useUrlState } from "@/hooks";
import { getErrorMessage } from "@/utils";
import PayButton from "../payments/pay-button";
import ReceiptButton from "../payments/receipt-button";
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

// Back from Stripe: wait for the webhook to settle the bill (the page never marks it paid itself)
export default function PaymentSuccess() {
  const { get } = useUrlState();
  const sessionId = get("session_id") || null;
  const query = usePaymentBySession(sessionId);

  if (!sessionId || query.isError) {
    return (
      <ResultCard
        icon={SearchX}
        tone="muted"
        title="We couldn't find this payment"
        description={
          query.isError
            ? getErrorMessage(query.error)
            : "The link is missing its checkout reference. Check your payments list for the latest status."
        }
        actions={paymentsLink}
      />
    );
  }

  if (query.isPending) {
    return (
      <ResultCard
        icon={Hourglass}
        tone="waiting"
        title="Checking your payment…"
        description="Hold on while we load the result from Stripe."
      >
        <Skeleton className="h-40 w-full rounded-2xl" />
      </ResultCard>
    );
  }

  const payment = query.data.data;

  if (payment.status === "PAID") {
    return (
      <ResultCard
        icon={CircleCheck}
        tone="success"
        title="Payment received"
        description="Thanks! Your rent is paid and the owner has been notified. A receipt is ready below."
        actions={
          <>
            {paymentsLink}
            <ReceiptButton payment={payment} size="default" />
          </>
        }
      >
        <BillSummary payment={payment} />
      </ResultCard>
    );
  }

  if (payment.status === "PENDING") {
    return (
      <ResultCard
        icon={Hourglass}
        tone="waiting"
        title={
          query.stillConfirming
            ? "Still confirming with Stripe"
            : "Confirming your payment…"
        }
        description={
          query.stillConfirming
            ? "This is taking longer than usual. You won't be charged twice; check back in a minute."
            : "Stripe has your payment. We're waiting for its confirmation, which usually takes a few seconds."
        }
        actions={
          query.stillConfirming ? (
            <>
              {paymentsLink}
              <Button onClick={() => query.refetch()}>Check again</Button>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> Checking every few seconds
            </p>
          )
        }
      >
        <BillSummary payment={payment} />
      </ResultCard>
    );
  }

  return (
    <ResultCard
      icon={CircleAlert}
      tone="danger"
      title="The payment didn't go through"
      description={
        payment.failureReason ??
        "Stripe couldn't complete it and no money was taken. You can try again."
      }
      actions={
        <>
          {paymentsLink}
          <PayButton payment={payment} size="default" />
        </>
      }
    >
      <BillSummary payment={payment} />
    </ResultCard>
  );
}
