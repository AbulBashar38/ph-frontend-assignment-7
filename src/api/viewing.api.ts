import apiClient from "@/lib/apiClient";
import type { ApiResponse, CreateViewingPayload, Viewing } from "@/types";

export function createViewing(payload: CreateViewingPayload) {
  return apiClient<ApiResponse<Viewing>>("/viewing", {
    method: "POST",
    body: payload,
  });
}
