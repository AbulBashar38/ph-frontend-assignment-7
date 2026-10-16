import type { QueryParams } from "./api.type";

export type NotificationType =
  | "VIEWING_REQUESTED"
  | "VIEWING_APPROVED"
  | "VIEWING_REJECTED"
  | "VIEWING_RESCHEDULED"
  | "VIEWING_CANCELLED"
  | "VIEWING_COMPLETED"
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_CANCELLED"
  | "RENTAL_STATUS_CHANGED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "APPLICATION_EXPIRED"
  | "RENT_BILL_CREATED"
  | "RENT_DUE"
  | "LISTING_EXPIRED"
  | "LISTING_SUSPENDED"
  | "LISTING_RESTORED"
  | "ROOMMATE_REQUEST_RECEIVED"
  | "ROOMMATE_REQUEST_ACCEPTED"
  | "ROOMMATE_REQUEST_DECLINED"
  | "ACCOUNT_STATUS_CHANGED"
  | "ROOM_AVAILABILITY_CHANGED";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  // Ids of the related records (roomId, propertyId, applicationId…)
  data: Record<string, string | null> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  userId: string;
}

export interface NotificationQueryParams extends QueryParams {
  isRead?: "true" | "false";
}
