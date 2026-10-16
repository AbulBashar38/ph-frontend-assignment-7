import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuditLog,
  AuditQueryParams,
  CreateAdminPayload,
  User,
  UserQueryParams,
  UserStatusPayload,
} from "@/types";

export function getUsers(params?: UserQueryParams) {
  return apiClient<ApiResponse<User[]>>("/user", { params });
}

export function updateUserStatus(id: string, payload: UserStatusPayload) {
  return apiClient<ApiResponse<User>>(`/user/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function createAdmin(payload: CreateAdminPayload) {
  return apiClient<ApiResponse<User>>("/user/admin", {
    method: "POST",
    body: payload,
  });
}

export function getAuditLogs(params?: AuditQueryParams) {
  return apiClient<ApiResponse<AuditLog[]>>("/audit", { params });
}
