"use client";

import type { Payment } from "@/types";
import { PAYABLE_STATUSES } from "@/types";
import PayButton from "./pay-button";
import ReceiptButton from "./receipt-button";

// Paid → receipt; still payable while the rental is live → pay
export default function TenantPaymentActions({
  payment,
}: {
  payment: Payment;
}) {
  if (payment.status === "PAID") return <ReceiptButton payment={payment} />;

  const rentalLive =
    payment.rental.status === "PENDING" || payment.rental.status === "ACTIVE";
  if (rentalLive && PAYABLE_STATUSES.includes(payment.status)) {
    return (
      <div className="flex justify-end">
        <PayButton payment={payment} />
      </div>
    );
  }

  return <span className="text-sm text-muted-foreground">—</span>;
}
