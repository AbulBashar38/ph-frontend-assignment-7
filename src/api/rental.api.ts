import apiClient, { apiBlob } from "@/lib/apiClient";
import type { ApiResponse, Rental, RentalStatusPayload } from "@/types";

export function updateRentalStatus(id: string, payload: RentalStatusPayload) {
  return apiClient<ApiResponse<Rental>>(`/rental/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

// PDF receipt of a paid bill
export function getPaymentReceipt(id: string) {
  return apiBlob(`/payment/${id}/receipt`);
}
