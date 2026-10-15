import apiClient from "@/lib/apiClient";
import type { ApiResponse, PublicRoomQueryParams, Room } from "@/types";

export function getPublicRooms(params?: PublicRoomQueryParams) {
  return apiClient<ApiResponse<Room[]>>("/room/public/available-rooms", {
    params,
  });
}

export function getPublicRoomById(id: string) {
  return apiClient<ApiResponse<Room>>(`/room/public/${id}`);
}
