"use client";

import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Multi-select chips (amenities, lifestyle tags…): each is a toggle button with aria-pressed
export default function TogglePicker<T extends string>({
  options,
  value,
  onChange,
  size = "default",
  label,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T[];
  onChange: (value: T[]) => void;
  size?: "default" | "lg";
  label?: string;
}) {
  const toggle = (item: T) =>
    onChange(
      value.includes(item)
        ? value.filter((selected) => selected !== item)
        : [...value, item],
    );

  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not form fields, so no fieldset
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(({ value: item, label: text, icon: Icon }) => (
        <Badge
          key={item}
          variant="chip"
          size={size}
          render={
            <button
              type="button"
              aria-pressed={value.includes(item)}
              onClick={() => toggle(item)}
            />
          }
        >
          {Icon && <Icon />}
          {text}
        </Badge>
      ))}
    </div>
  );
}
