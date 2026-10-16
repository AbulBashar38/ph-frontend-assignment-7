import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPaymentById, getPaymentBySession, startCheckout } from "@/api";

// Opens Stripe Checkout for a bill. Never marks anything paid: only Stripe's webhook does that.
export function useStartCheckout() {
  return useMutation({
    mutationFn: startCheckout,
    onSuccess: (response) => {
      window.location.href = response.data.paymentUrl;
    },
  });
}

export function usePayment(id: string | null) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentById(id as string),
    enabled: Boolean(id),
  });
}

// How long the success page waits for the webhook before saying it's still being confirmed
const CONFIRM_TIMEOUT_MS = 30_000;

// The bill behind a finished checkout; re-checks every 2 s while Stripe's webhook hasn't settled it yet
export function usePaymentBySession(sessionId: string | null) {
  const [startedAt] = useState(() => Date.now());
  const query = useQuery({
    queryKey: ["payment-session", sessionId],
    queryFn: () => getPaymentBySession(sessionId as string),
    enabled: Boolean(sessionId),
    refetchInterval: (current) =>
      current.state.data?.data.status === "PENDING" &&
      Date.now() - startedAt < CONFIRM_TIMEOUT_MS
        ? 2000
        : false,
  });
  const stillConfirming =
    query.data?.data.status === "PENDING" &&
    Date.now() - startedAt >= CONFIRM_TIMEOUT_MS;

  return { ...query, stillConfirming };
}
