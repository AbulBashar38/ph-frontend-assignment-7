import type { QueryParams } from "./api.type";

export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "HOSTEL"
  | "SUBLET"
  | "STUDIO";

export type PropertyStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "INACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

export type Amenity =
  | "WIFI"
  | "AC"
  | "PARKING"
  | "LIFT"
  | "GENERATOR"
  | "GAS"
  | "CCTV"
  | "SECURITY_GUARD"
  | "FURNISHED"
  | "WATER_SUPPLY"
  | "KITCHEN"
  | "LAUNDRY"
  | "BALCONY"
  | "ROOFTOP"
  | "ATTACHED_BATHROOM";

export type RoomType = "SINGLE" | "SHARED" | "MASTER" | "STUDIO";

export type RoomStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "OCCUPIED"
  | "UNAVAILABLE"
  | "MAINTENANCE";

// Public endpoints return only id + url; management endpoints add the Cloudinary fields
export interface PropertyImage {
  id: string;
  url: string;
  publicId?: string;
  propertyId?: string;
  createdAt?: string;
}

export interface RoomSummary {
  id: string;
  name: string;
  roomType: RoomType;
  monthlyRent: number;
  maxOccupants: number;
  currentOccupants: number;
  status: RoomStatus;
  availableFrom: string | null;
}

export interface PropertyOwner {
  id: string;
  name: string;
  imageUrl?: string | null;
  phone?: string | null;
  email?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  amenities: Amenity[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  availableRoomCount: number;
  minAvailableRent: number | null;
  earliestAvailableFrom: string | null;
  images: PropertyImage[];
  rooms: RoomSummary[];
  ownerId?: string;
  owner?: PropertyOwner;
  status?: PropertyStatus;
}

export interface PublicPropertyQueryParams extends QueryParams {
  city?: string;
  area?: string;
  propertyType?: PropertyType;
  amenities?: string;
  minRent?: number;
  maxRent?: number;
  roomType?: RoomType;
  occupants?: number;
  availableOnly?: boolean;
  availableBy?: string;
}
