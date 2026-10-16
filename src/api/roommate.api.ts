import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  MyRoommateProfile,
  QueryParams,
  RoommateConnection,
  RoommateMatch,
  RoommateMatchQueryParams,
  RoommateProfilePayload,
  RoommateRequest,
  RoommateRequestQueryParams,
  RoommateRequestStatus,
} from "@/types";

export function getMyRoommateProfile() {
  return apiClient<ApiResponse<MyRoommateProfile>>("/roommate/profile/me");
}

export function createRoommateProfile(payload: RoommateProfilePayload) {
  return apiClient<ApiResponse<MyRoommateProfile>>("/roommate/profile", {
    method: "POST",
    body: payload,
  });
}

export function updateRoommateProfile(payload: RoommateProfilePayload) {
  return apiClient<ApiResponse<MyRoommateProfile>>("/roommate/profile/me", {
    method: "PATCH",
    body: payload,
  });
}

// Pause or resume appearing in matches
export function updateRoommateSearch(isActive: boolean) {
  return apiClient<ApiResponse<MyRoommateProfile>>(
    "/roommate/profile/me/status",
    { method: "PATCH", body: { isActive } },
  );
}

export function getRoommateMatches(params?: RoommateMatchQueryParams) {
  return apiClient<ApiResponse<RoommateMatch[]>>("/roommate/matches", {
    params,
  });
}

export function getRoommateProfile(id: string) {
  return apiClient<ApiResponse<RoommateMatch>>(`/roommate/profile/${id}`);
}

export function sendRoommateRequest(payload: {
  receiverProfileId: string;
  message?: string;
}) {
  return apiClient<ApiResponse<RoommateRequest>>("/roommate/requests", {
    method: "POST",
    body: payload,
  });
}

export function getRoommateRequests(params?: RoommateRequestQueryParams) {
  return apiClient<ApiResponse<RoommateRequest[]>>("/roommate/requests", {
    params,
  });
}

export function updateRoommateRequestStatus(
  id: string,
  status: Exclude<RoommateRequestStatus, "PENDING">,
) {
  return apiClient<ApiResponse<RoommateRequest>>(
    `/roommate/requests/${id}/status`,
    { method: "PATCH", body: { status } },
  );
}

export function getRoommateConnections(params?: QueryParams) {
  return apiClient<ApiResponse<RoommateConnection[]>>("/roommate/connections", {
    params,
  });
}
