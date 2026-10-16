import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Application,
  ApplicationStatusPayload,
  CreateApplicationPayload,
} from "@/types";

export function createApplication(payload: CreateApplicationPayload) {
  return apiClient<ApiResponse<Application>>("/application", {
    method: "POST",
    body: payload,
  });
}

export function updateApplicationStatus(
  id: string,
  payload: ApplicationStatusPayload,
) {
  return apiClient<ApiResponse<Application>>(`/application/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}
