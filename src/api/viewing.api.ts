import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateViewingPayload,
  Viewing,
  ViewingStatusPayload,
} from "@/types";

export function createViewing(payload: CreateViewingPayload) {
  return apiClient<ApiResponse<Viewing>>("/viewing", {
    method: "POST",
    body: payload,
  });
}

export function updateViewingStatus(id: string, payload: ViewingStatusPayload) {
  return apiClient<ApiResponse<Viewing>>(`/viewing/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}
