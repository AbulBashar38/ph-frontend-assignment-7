import apiClient from "@/lib/apiClient";
import type { ApiResponse, CheckoutSession, Payment } from "@/types";

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<Payment>>(`/payment/${id}`);
}

// The payment a Stripe Checkout Session belongs to (the success page polls this until the webhook marks it PAID)
export function getPaymentBySession(sessionId: string) {
  return apiClient<ApiResponse<Payment>>(`/payment/session/${sessionId}`);
}

// Starts (or reuses) a Stripe Checkout Session for a bill; the browser then goes to paymentUrl
export function startCheckout(id: string) {
  return apiClient<ApiResponse<CheckoutSession>>(`/payment/${id}/checkout`, {
    method: "POST",
  });
}
