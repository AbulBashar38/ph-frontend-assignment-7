export type ViewingStatus =
  | "PENDING"
  | "APPROVED"
  | "RESCHEDULED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface CreateViewingPayload {
  propertyId: string;
  roomId?: string;
  // ISO date-time with offset
  preferredAt: string;
  message?: string;
}

export interface Viewing {
  id: string;
  preferredAt: string;
  message: string | null;
  status: ViewingStatus;
  scheduledAt: string | null;
  ownerNote: string | null;
  respondedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  roomId: string | null;
}
