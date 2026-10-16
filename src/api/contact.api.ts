import apiClient from "@/lib/apiClient";
import type { ApiResponse, ContactPayload } from "@/types";

export function sendContactMessage(payload: ContactPayload) {
  return apiClient<ApiResponse<null>>("/contact", {
    method: "POST",
    body: payload,
  });
}
