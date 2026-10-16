"use client";

import { useForm } from "@tanstack/react-form";
import type { ReactNode } from "react";
import AmenityPicker from "@/components/shared/amenity-picker";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import type { Amenity } from "@/types";
import { propertyAmenitiesSchema } from "@/validation";
import FormActions from "./form-actions";

// Building-wide amenities (wizard step 3 and the edit page); room-only ones go on each room
export default function PropertyAmenitiesForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitIcon,
  pending,
  secondary,
}: {
  defaultValues: Amenity[];
  onSubmit: (amenities: Amenity[]) => void;
  submitLabel: string;
  submitIcon?: ReactNode;
  pending?: boolean;
  secondary?: ReactNode;
}) {
  const form = useForm({
    defaultValues: { amenities: defaultValues },
    validators: { onSubmit: propertyAmenitiesSchema },
    onSubmit: ({ value }) => onSubmit(value.amenities),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="amenities">
          {(field) => (
            <div className="space-y-3">
              <FieldDescription>
                Pick everything the building offers. Tenants filter by these, so
                listings with accurate amenities show up in more searches.
              </FieldDescription>
              <AmenityPicker
                label="Building amenities"
                size="lg"
                value={field.state.value}
                onChange={field.handleChange}
              />
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {field.state.value.length} selected
              </p>
            </div>
          )}
        </form.Field>

        <FormActions
          submitLabel={submitLabel}
          icon={submitIcon}
          pending={pending}
          secondary={secondary}
        />
      </FieldGroup>
    </form>
  );
}
