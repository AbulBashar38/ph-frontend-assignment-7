import type { QueryParams } from "./api.type";
import type { Application, ApplicationStatus } from "./application.type";
import type {
  Amenity,
  Property,
  PropertyStatus,
  PropertyType,
  RoomStatus,
  RoomType,
} from "./property.type";
import type { Room } from "./room.type";
import type { Gender } from "./user.type";
import type { Viewing, ViewingStatus } from "./viewing.type";

// People and places as the list endpoints embed them
export interface PersonSummary {
  id: string;
  name: string;
  imageUrl: string | null;
  phone: string | null;
}

export interface TenantSummary extends PersonSummary {
  gender?: Gender | null;
  occupation?: string | null;
}

export interface PlaceSummary {
  id: string;
  title: string;
  address: string;
  city: string;
  area: string;
}

export interface ApplicationListItem extends Application {
  property: PlaceSummary & { ownerId: string; owner: PersonSummary };
  room: {
    id: string;
    name: string;
    roomType: RoomType;
    monthlyRent: number;
    maxOccupants: number;
    status: RoomStatus;
  };
  tenant: TenantSummary;
  rental: { id: string; status: RentalStatus } | null;
}

export interface ViewingListItem extends Viewing {
  property: PlaceSummary & { ownerId: string; owner: PersonSummary };
  room: {
    id: string;
    name: string;
    roomType: RoomType;
    monthlyRent: number;
  } | null;
  tenant: PersonSummary;
}

export type RentalStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "TERMINATED";

// PATCH /rental/:id/status: COMPLETED ends an ACTIVE rental; TERMINATED ends a PENDING or ACTIVE one early
export type RentalStatusPayload =
  | { status: "COMPLETED" }
  | { status: "TERMINATED"; reason: string };

export interface Rental {
  id: string;
  monthlyRent: number;
  occupants: number;
  startDate: string;
  endDate: string | null;
  status: RentalStatus;
  activatedAt: string | null;
  completedAt: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
  createdAt: string;
  updatedAt: string;
  applicationId: string;
  tenantId: string;
  ownerId: string;
  propertyId: string;
  roomId: string;
  property: PlaceSummary;
  room: { id: string; name: string; roomType: RoomType; status: RoomStatus };
  tenant: PersonSummary;
  owner: PersonSummary;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface Payment {
  id: string;
  periodNumber: number;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  rentalId: string;
  tenantId: string;
  tenant: PersonSummary;
  rental: {
    id: string;
    status: RentalStatus;
    startDate: string;
    monthlyRent: number;
    ownerId: string;
    owner: PersonSummary;
    property: PlaceSummary;
    room: { id: string; name: string; roomType: RoomType };
  };
}

// The owner's own listings (GET /property, GET /room) include private fields
export interface ManagedProperty extends Property {
  status: PropertyStatus;
  moderationNote: string | null;
}

export interface ManagedRoom extends Omit<Room, "property"> {
  currentOccupants: number;
  propertyId: string;
  property: {
    id: string;
    title: string;
    status: PropertyStatus;
    city: string;
    area: string;
    ownerId: string;
  };
}

// Payloads for the owner's property and room forms (dates as ISO strings)
export interface PropertyPayload {
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  area: string;
  amenities: Amenity[];
}

export interface RoomPayload {
  name: string;
  roomType: RoomType;
  monthlyRent: number;
  maxOccupants: number;
  description?: string | null;
  amenities: Amenity[];
  availableFrom?: string | null;
}

export type ManualPropertyStatus = "PUBLISHED" | "INACTIVE" | "SUSPENDED";
export type ManualRoomStatus = "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE";

export interface StatusQueryParams<TStatus extends string> extends QueryParams {
  status?: TStatus;
  propertyId?: string;
  roomId?: string;
}

export type ApplicationQueryParams = StatusQueryParams<ApplicationStatus>;
export type ViewingQueryParams = StatusQueryParams<ViewingStatus>;
export type RentalQueryParams = StatusQueryParams<RentalStatus>;
export type PaymentQueryParams = StatusQueryParams<PaymentStatus>;
export type ManagedPropertyQueryParams = StatusQueryParams<PropertyStatus>;
export type ManagedRoomQueryParams = StatusQueryParams<RoomStatus>;

// GET /analytics
export interface PlatformStats {
  users: {
    total: number;
    tenants: number;
    owners: number;
    admins: number;
    active: number;
    blocked: number;
  };
  properties: {
    total: number;
    published: number;
    byStatus: Record<PropertyStatus, number>;
  };
  rooms: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    byStatus: Record<RoomStatus, number>;
  };
  applications: {
    total: number;
    pending: number;
    byStatus: Record<ApplicationStatus, number>;
  };
  rentals: {
    total: number;
    active: number;
    pending: number;
    byStatus: Record<RentalStatus, number>;
  };
  payments: {
    total: number;
    paid: number;
    unpaid: number;
    totalRevenue: number;
    currency: string;
    byStatus: Record<PaymentStatus, number>;
    monthlyRevenue: { month: string; revenue: number; payments: number }[];
  };
}
