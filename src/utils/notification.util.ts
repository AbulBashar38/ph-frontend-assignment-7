import type { Notification, UserRole } from "@/types";
import { getDashboardPath } from "./role.util";

// Where a notification leads for this user; null when there's nothing to open
export function getNotificationHref(
  notification: Notification,
  role: UserRole,
): string | null {
  const base = getDashboardPath(role);
  const { type, data } = notification;

  if (type.startsWith("VIEWING_")) return `${base}/viewings`;
  if (type.startsWith("APPLICATION_")) return `${base}/applications`;
  if (type === "RENTAL_STATUS_CHANGED") return `${base}/rentals`;
  if (type.startsWith("PAYMENT_") || type.startsWith("RENT_")) {
    return `${base}/payments`;
  }
  if (type.startsWith("LISTING_")) {
    return role === "OWNER" && data?.propertyId
      ? `/owner/properties/${data.propertyId}`
      : `${base}/properties`;
  }
  if (type.startsWith("ROOMMATE_REQUEST_")) {
    return type === "ROOMMATE_REQUEST_ACCEPTED"
      ? "/dashboard/roommate/connections"
      : "/dashboard/roommate/requests";
  }
  if (type === "ROOM_AVAILABILITY_CHANGED" && data?.roomId) {
    return `/rooms/${data.roomId}`;
  }
  if (type === "ACCOUNT_STATUS_CHANGED") return `${base}/profile`;
  return null;
}
