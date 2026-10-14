import apiClient from "@/lib/apiClient";
import type { ApiResponse, Property, PublicPropertyQueryParams } from "@/types";

export function getPublicProperties(params?: PublicPropertyQueryParams) {
  return apiClient<ApiResponse<Property[]>>("/property/public/all-properties", {
    params,
  });
}

export function getPublicPropertyById(id: string) {
  return apiClient<ApiResponse<Property>>(`/property/public/${id}`);
}
