import type { QueryParams } from "./api.type";
import type {
  Amenity,
  PropertyImage,
  PropertyOwner,
  PropertyType,
  RoomStatus,
  RoomType,
} from "./property.type";

export type RoomImage = PropertyImage;

// The property a public room belongs to (GET /room/public/*)
export interface RoomProperty {
  id: string;
  title: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  area: string;
  amenities: Amenity[];
  images: PropertyImage[];
  owner: PropertyOwner;
}

export interface Room {
  id: string;
  name: string;
  roomType: RoomType;
  monthlyRent: number;
  maxOccupants: number;
  description: string | null;
  amenities: Amenity[];
  availableFrom: string | null;
  status: RoomStatus;
  createdAt: string;
  images: RoomImage[];
  property: RoomProperty;
}

export interface PublicRoomQueryParams extends QueryParams {
  city?: string;
  area?: string;
  propertyType?: PropertyType;
  propertyId?: string;
  roomType?: RoomType;
  minRent?: number;
  maxRent?: number;
  occupants?: number;
  amenities?: string;
  availableBy?: string;
}
