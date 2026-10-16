import {
  ArrowUpDown,
  Bath,
  Building,
  Cctv,
  Check,
  CookingPot,
  Droplets,
  Fence,
  Flame,
  type LucideIcon,
  ParkingSquare,
  ShieldCheck,
  Snowflake,
  Sofa,
  WashingMachine,
  Wifi,
  Zap,
} from "lucide-react";
import type { Amenity } from "@/types";
import { formatEnum } from "@/utils";

export const AMENITY_ICONS: Record<Amenity, LucideIcon> = {
  WIFI: Wifi,
  AC: Snowflake,
  PARKING: ParkingSquare,
  LIFT: ArrowUpDown,
  GENERATOR: Zap,
  GAS: Flame,
  CCTV: Cctv,
  SECURITY_GUARD: ShieldCheck,
  FURNISHED: Sofa,
  WATER_SUPPLY: Droplets,
  KITCHEN: CookingPot,
  LAUNDRY: WashingMachine,
  BALCONY: Fence,
  ROOFTOP: Building,
  ATTACHED_BATHROOM: Bath,
};

// Acronyms and brand spellings that formatEnum would get wrong ("Ac", "Wifi")
const AMENITY_LABELS: Partial<Record<Amenity, string>> = {
  WIFI: "Wi-Fi",
  AC: "AC",
  CCTV: "CCTV",
};

export const amenityLabel = (amenity: Amenity) =>
  AMENITY_LABELS[amenity] ?? formatEnum(amenity);

// Every amenity the backend knows, in display order (used by filters)
export const ALL_AMENITIES = Object.keys(AMENITY_ICONS) as Amenity[];

// Grid of amenities with icons
export default function AmenityList({ amenities }: { amenities: Amenity[] }) {
  if (amenities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No amenities listed.</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity] ?? Check;
        return (
          <li
            key={amenity}
            className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-sm"
          >
            <Icon className="size-4 shrink-0 text-primary" />
            {amenityLabel(amenity)}
          </li>
        );
      })}
    </ul>
  );
}
