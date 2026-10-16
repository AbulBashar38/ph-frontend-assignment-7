"use client";

import { Badge } from "@/components/ui/badge";
import type { Amenity } from "@/types";
import { ALL_AMENITIES, AMENITY_ICONS, amenityLabel } from "./amenity-list";

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
  const toggle = (amenity: Amenity) =>
    onChange(
      value.includes(amenity)
        ? value.filter((item) => item !== amenity)
        : [...value, amenity],
    );

  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not form fields, so no fieldset
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {ALL_AMENITIES.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        return (
          <Badge
            key={amenity}
            variant="chip"
            size={size}
            render={
              <button
                type="button"
                aria-pressed={value.includes(amenity)}
                onClick={() => toggle(amenity)}
              />
            }
          >
            <Icon />
            {amenityLabel(amenity)}
          </Badge>
        );
      })}
    </div>
  );
}
