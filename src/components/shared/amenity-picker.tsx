"use client";

import type { Amenity } from "@/types";
import { ALL_AMENITIES, AMENITY_ICONS, amenityLabel } from "./amenity-list";
import TogglePicker from "./toggle-picker";

const OPTIONS = ALL_AMENITIES.map((amenity) => ({
  value: amenity,
  label: amenityLabel(amenity),
  icon: AMENITY_ICONS[amenity],
}));

// Toggle chips for choosing amenities (filters, property and room forms)
export default function AmenityPicker({
  value,
  onChange,
  size = "default",
  label,
}: {
  value: Amenity[];
  onChange: (amenities: Amenity[]) => void;
  size?: "default" | "lg";
  label?: string;
}) {
  return (
    <TogglePicker
      options={OPTIONS}
      value={value}
      onChange={onChange}
      size={size}
      label={label}
    />
  );
}
