import apiClient from "@/lib/apiClient";
import { uploadWithProgress } from "@/lib/uploadWithProgress";
import type { ApiResponse, UpdateProfilePayload, User } from "@/types";

export function updateUser(id: string, payload: UpdateProfilePayload) {
  return apiClient<ApiResponse<User>>(`/user/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(
  id: string,
  file: File,
  onProgress: (percent: number) => void,
) {
  const formData = new FormData();
  formData.append("profileImage", file);
  return uploadWithProgress<ApiResponse<User>>(
    `/user/${id}/profile-image`,
    formData,
    onProgress,
  );
}

export function removeProfileImage(id: string) {
  return apiClient<ApiResponse<User>>(`/user/${id}/profile-image`, {
    method: "DELETE",
  });
}
