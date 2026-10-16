import apiClient from "@/lib/apiClient";
import { uploadWithProgress } from "@/lib/uploadWithProgress";
import type {
  ApiResponse,
  ManagedProperty,
  ManagedRoom,
  ManualPropertyStatus,
  ManualRoomStatus,
  PropertyPayload,
  RoomPayload,
} from "@/types";

const imagesFormData = (files: File[]) => {
  const formData = new FormData();
  for (const file of files) formData.append("images", file);
  return formData;
};

// ----- properties (owner / admin) -----

export function getManagedPropertyById(id: string) {
  return apiClient<ApiResponse<ManagedProperty>>(`/property/${id}`);
}

export function createProperty(payload: PropertyPayload) {
  return apiClient<ApiResponse<ManagedProperty>>("/property", {
    method: "POST",
    body: payload,
  });
}

export function updateProperty(id: string, payload: Partial<PropertyPayload>) {
  return apiClient<ApiResponse<ManagedProperty>>(`/property/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updatePropertyStatus(
  id: string,
  payload: { status: ManualPropertyStatus; reason?: string },
) {
  return apiClient<ApiResponse<ManagedProperty>>(`/property/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function archiveProperty(id: string) {
  return apiClient<ApiResponse<null>>(`/property/${id}`, { method: "DELETE" });
}

export function uploadPropertyImages(
  id: string,
  files: File[],
  onProgress: (percent: number) => void,
) {
  return uploadWithProgress<ApiResponse<ManagedProperty>>(
    `/property/${id}/images`,
    imagesFormData(files),
    onProgress,
  );
}

export function deletePropertyImage(id: string, imageId: string) {
  return apiClient<ApiResponse<ManagedProperty>>(
    `/property/${id}/images/${imageId}`,
    { method: "DELETE" },
  );
}

// ----- rooms -----

export function createRoom(propertyId: string, payload: RoomPayload) {
  return apiClient<ApiResponse<ManagedRoom>>("/room", {
    method: "POST",
    body: { propertyId, ...payload },
  });
}

export function updateRoom(id: string, payload: Partial<RoomPayload>) {
  return apiClient<ApiResponse<ManagedRoom>>(`/room/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateRoomStatus(id: string, status: ManualRoomStatus) {
  return apiClient<ApiResponse<ManagedRoom>>(`/room/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function archiveRoom(id: string) {
  return apiClient<ApiResponse<null>>(`/room/${id}`, { method: "DELETE" });
}

export function uploadRoomImages(
  id: string,
  files: File[],
  onProgress: (percent: number) => void,
) {
  return uploadWithProgress<ApiResponse<ManagedRoom>>(
    `/room/${id}/images`,
    imagesFormData(files),
    onProgress,
  );
}

export function deleteRoomImage(id: string, imageId: string) {
  return apiClient<ApiResponse<ManagedRoom>>(`/room/${id}/images/${imageId}`, {
    method: "DELETE",
  });
}
