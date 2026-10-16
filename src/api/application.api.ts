import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Application,
  CreateApplicationPayload,
} from "@/types";

export function createApplication(payload: CreateApplicationPayload) {
  return apiClient<ApiResponse<Application>>("/application", {
    method: "POST",
    body: payload,
  });
}
