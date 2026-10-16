import z from "zod";
import type {
  Amenity,
  PropertyPayload,
  PropertyType,
  RoomPayload,
  RoomType,
} from "@/types";

// Same limits as the backend (property.validation.ts, room.validation.ts)
export const PROPERTY_TYPES: PropertyType[] = [
  "APARTMENT",
  "HOUSE",
  "HOSTEL",
  "SUBLET",
  "STUDIO",
];
export const ROOM_TYPES: RoomType[] = ["SINGLE", "SHARED", "MASTER", "STUDIO"];

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(
      min,
      min === 1
        ? `${label} is required`
        : `${label} must be at least ${min} characters`,
    )
    .max(max, `${label} must be at most ${max} characters`);

const amenities = z.array(z.custom<Amenity>());

// "" until the owner picks one, so the select can start empty
export interface PropertyDetailsValues {
  title: string;
  description: string;
  propertyType: PropertyType | "";
}

export const propertyDetailsSchema = z.object({
  title: text("Title", 5, 120),
  description: text("Description", 20, 5000),
  propertyType: z
    .custom<PropertyType | "">()
    .refine(
      (value) => PROPERTY_TYPES.includes(value as PropertyType),
      "Choose a property type",
    ),
});

export interface PropertyLocationValues {
  address: string;
  city: string;
  area: string;
}

export const propertyLocationSchema = z.object({
  address: text("Address", 5, 200),
  city: text("City", 2, 50),
  area: text("Area", 2, 80),
});

export const propertyAmenitiesSchema = z.object({ amenities });

export interface RoomFormValues {
  name: string;
  roomType: RoomType | "";
  monthlyRent: number;
  maxOccupants: number;
  description: string;
  // <input type="date"> value, "" when available now
  availableFrom: string;
  amenities: Amenity[];
}

export const EMPTY_ROOM: RoomFormValues = {
  name: "",
  roomType: "",
  monthlyRent: Number.NaN,
  maxOccupants: 1,
  description: "",
  availableFrom: "",
  amenities: [],
};

export const roomSchema = z.object({
  name: text("Room name", 1, 50),
  roomType: z
    .custom<RoomType | "">()
    .refine(
      (value) => ROOM_TYPES.includes(value as RoomType),
      "Choose a room type",
    ),
  monthlyRent: z
    .number("Enter the monthly rent")
    .int("Rent must be a whole number of taka")
    .min(500, "Rent must be at least ৳500")
    .max(10_000_000, "Rent is too high"),
  maxOccupants: z
    .number("Enter how many people fit")
    .int("Enter a whole number")
    .min(1, "At least 1 person")
    .max(20, "At most 20 people"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters"),
  availableFrom: z.string(),
  amenities,
});

export function toPropertyPayload(
  details: PropertyDetailsValues,
  location: PropertyLocationValues,
  amenityList: Amenity[],
): PropertyPayload {
  return {
    title: details.title.trim(),
    description: details.description.trim(),
    propertyType: details.propertyType as PropertyType,
    address: location.address.trim(),
    city: location.city.trim(),
    area: location.area.trim(),
    amenities: amenityList,
  };
}

export function toRoomPayload(values: RoomFormValues): RoomPayload {
  return {
    name: values.name.trim(),
    roomType: values.roomType as RoomType,
    monthlyRent: values.monthlyRent,
    maxOccupants: values.maxOccupants,
    description: values.description.trim() || null,
    amenities: values.amenities,
    // A date, not a moment: noon UTC is the same calendar day in every timezone
    availableFrom: values.availableFrom
      ? `${values.availableFrom}T12:00:00.000Z`
      : null,
  };
}
