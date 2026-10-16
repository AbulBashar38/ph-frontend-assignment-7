"use client";

import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStartCheckout } from "@/hooks";
import type { Payment } from "@/types";
import { formatCurrency, getErrorMessage } from "@/utils";

// Sends the tenant to Stripe Checkout (test mode) for one bill
export default function PayButton({
  payment,
  size = "xs",
}: {
  payment: Payment;
  size?: "xs" | "default";
}) {
  const checkout = useStartCheckout();
  // Stays busy while the browser leaves for Stripe
  const busy = checkout.isPending || checkout.isSuccess;

  return (
    <Button
      size={size}
      disabled={busy}
      onClick={() =>
        checkout.mutate(payment.id, {
          onError: (error) => toast.error(getErrorMessage(error)),
        })
      }
    >
      {busy ? <Spinner /> : <CreditCard />}
      {busy
        ? "Opening Stripe…"
        : payment.status === "PENDING"
          ? `Pay ${formatCurrency(payment.amount)}`
          : "Try again"}
    </Button>
  );
}
