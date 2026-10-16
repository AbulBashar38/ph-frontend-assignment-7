import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ApplicationListItem,
  ApplicationQueryParams,
  ManagedProperty,
  ManagedPropertyQueryParams,
  ManagedRoom,
  ManagedRoomQueryParams,
  Payment,
  PaymentQueryParams,
  PlatformStats,
  Rental,
  RentalQueryParams,
  ViewingListItem,
  ViewingQueryParams,
} from "@/types";

// Each list returns only what the caller may see: a tenant their own, an owner their properties', admins everything

export function getApplications(params?: ApplicationQueryParams) {
  return apiClient<ApiResponse<ApplicationListItem[]>>("/application", {
    params,
  });
}

export function getViewings(params?: ViewingQueryParams) {
  return apiClient<ApiResponse<ViewingListItem[]>>("/viewing", { params });
}

export function getRentals(params?: RentalQueryParams) {
  return apiClient<ApiResponse<Rental[]>>("/rental", { params });
}

export function getPayments(params?: PaymentQueryParams) {
  return apiClient<ApiResponse<Payment[]>>("/payment", { params });
}

export function getManagedProperties(params?: ManagedPropertyQueryParams) {
  return apiClient<ApiResponse<ManagedProperty[]>>("/property", { params });
}

export function getManagedRooms(params?: ManagedRoomQueryParams) {
  return apiClient<ApiResponse<ManagedRoom[]>>("/room", { params });
}

export function getPlatformStats() {
  return apiClient<ApiResponse<PlatformStats>>("/analytics");
}
