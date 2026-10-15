"use client";

import { Building2, KeyRound } from "lucide-react";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { RegisterRole } from "@/types";

// "Find a place" (tenant) or "Rent out space" (owner): used by sign-up and the new-Google-account dialog
export default function RoleChoice({
  value,
  onChange,
  className,
}: {
  value: RegisterRole | null;
  onChange: (role: RegisterRole) => void;
  className?: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as RegisterRole)}
      aria-label="Account type"
      className={cn("grid-cols-1 gap-3 sm:grid-cols-2", className)}
    >
      <RadioCard
        value="TENANT"
        icon={<KeyRound />}
        title="Find a place"
        description="Rent a room or find roommates"
      />
      <RadioCard
        value="OWNER"
        icon={<Building2 />}
        title="Rent out space"
        description="List properties and rooms"
      />
    </RadioGroup>
  );
}
