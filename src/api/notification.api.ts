import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Notification,
  NotificationQueryParams,
} from "@/types";

export function getNotifications(params?: NotificationQueryParams) {
  return apiClient<ApiResponse<Notification[]>>("/notification", { params });
}

export function getUnreadNotificationCount() {
  return apiClient<ApiResponse<{ unreadCount: number }>>(
    "/notification/unread-count",
  );
}

export function markNotificationRead(id: string) {
  return apiClient<ApiResponse<Notification>>(`/notification/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllNotificationsRead() {
  return apiClient<ApiResponse<null>>("/notification/read-all", {
    method: "PATCH",
  });
}
