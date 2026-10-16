import type { QueryParams } from "./api.type";
import type { AuthProvider, UserRole, UserStatus } from "./user.type";

export interface UserQueryParams extends QueryParams {
  role?: UserRole;
  status?: UserStatus;
  authProvider?: AuthProvider;
}

// PATCH /user/:id/status: blocking needs a reason (emailed to the user)
export type UserStatusPayload =
  | { status: "BLOCKED"; reason: string }
  | { status: "ACTIVE" };

// POST /user/admin (SUPER_ADMIN only)
export interface CreateAdminPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const AUDIT_RESOURCES = [
  "User",
  "Property",
  "Room",
  "Application",
  "Rental",
  "Payment",
  "RoommateRequest",
] as const;
export type AuditResource = (typeof AUDIT_RESOURCES)[number];

// Same as the backend's AuditAction enum
export const AUDIT_ACTIONS = [
  "USER_UPDATED",
  "USER_DELETED",
  "USER_BLOCKED",
  "USER_ACTIVATED",
  "ADMIN_CREATED",
  "PROPERTY_CREATED",
  "PROPERTY_UPDATED",
  "PROPERTY_PUBLISHED",
  "PROPERTY_DISABLED",
  "PROPERTY_ARCHIVED",
  "PROPERTY_SUSPENDED",
  "PROPERTY_RESTORED",
  "PROPERTY_EXPIRED",
  "ROOM_CREATED",
  "ROOM_UPDATED",
  "ROOM_STATUS_CHANGED",
  "ROOM_ARCHIVED",
  "APPLICATION_SUBMITTED",
  "APPLICATION_APPROVED",
  "APPLICATION_REJECTED",
  "APPLICATION_CANCELLED",
  "APPLICATION_EXPIRED",
  "RENTAL_CREATED",
  "RENTAL_STATUS_CHANGED",
  "PAYMENT_COMPLETED",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
  "ROOMMATE_REQUEST_SENT",
  "ROOMMATE_REQUEST_ACCEPTED",
  "ROOMMATE_REQUEST_DECLINED",
  "ROOMMATE_REQUEST_CANCELLED",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLog {
  id: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: string;
  // null for the cron jobs and the Stripe webhook
  actorId: string | null;
  actorRole: UserRole | null;
  actor: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isDeleted: boolean;
  } | null;
}

export interface AuditQueryParams extends QueryParams {
  action?: AuditAction;
  resource?: AuditResource;
  actorRole?: UserRole;
}
