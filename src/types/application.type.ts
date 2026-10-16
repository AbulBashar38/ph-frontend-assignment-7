export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export interface CreateApplicationPayload {
  roomId: string;
  // ISO date-time with offset
  moveInDate: string;
  occupants: number;
  message?: string;
}

export interface Application {
  id: string;
  moveInDate: string;
  occupants: number;
  message: string | null;
  status: ApplicationStatus;
  // After this a PENDING application can no longer be approved (it becomes EXPIRED)
  expiresAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  roomId: string;
}

// PATCH /application/:id/status: the body depends on the new status
export type ApplicationStatusPayload =
  | { status: "APPROVED" }
  | { status: "REJECTED"; rejectionReason?: string }
  | { status: "CANCELLED"; reason?: string };
