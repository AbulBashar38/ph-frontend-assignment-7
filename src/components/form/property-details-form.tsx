"use client";

import { useForm } from "@tanstack/react-form";
import {
  BedDouble,
  Building,
  DoorOpen,
  Home,
  type LucideIcon,
  Sofa,
} from "lucide-react";
import type { ReactNode } from "react";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyType } from "@/types";
import {
  PROPERTY_TYPES,
  type PropertyDetailsValues,
  propertyDetailsSchema,
} from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

const TYPE_INFO: Record<PropertyType, { icon: LucideIcon; hint: string }> = {
  APARTMENT: { icon: Building, hint: "A flat in a building" },
  HOUSE: { icon: Home, hint: "A whole or shared house" },
  HOSTEL: { icon: BedDouble, hint: "Beds or rooms for students" },
  SUBLET: { icon: DoorOpen, hint: "Rooms in a flat you rent" },
  STUDIO: { icon: Sofa, hint: "One self-contained room" },
};

const typeTitle = (type: PropertyType) =>
  type.charAt(0) + type.slice(1).toLowerCase();

// Title, type and description of a listing (wizard step 1 and the edit page)
export default function PropertyDetailsForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitIcon,
  pending,
  secondary,
}: {
  defaultValues: PropertyDetailsValues;
  onSubmit: (values: PropertyDetailsValues) => void;
  submitLabel: string;
  submitIcon?: ReactNode;
  pending?: boolean;
  secondary?: ReactNode;
}) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: propertyDetailsSchema,
      onSubmit: propertyDetailsSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
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
        <form.Field name="title">
          {(field) => (
            <FormField
              field={field}
              id="property-title"
              label="Listing title"
              description="What a tenant sees first, e.g. “Bright 2-bed flat near Dhanmondi Lake”."
            >
              {(isInvalid) => (
                <Input
                  id="property-title"
                  maxLength={120}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
              )}
            </FormField>
          )}
        </form.Field>

        <form.Field name="propertyType">
          {(field) => (
            <FormField field={field} id="property-type" label="Property type">
              {(isInvalid) => (
                <RadioGroup
                  id="property-type"
                  aria-label="Property type"
                  aria-invalid={isInvalid}
                  value={field.state.value || null}
                  onValueChange={(value) => {
                    field.handleChange(value as PropertyType);
                    field.handleBlur();
                  }}
                  className="grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {PROPERTY_TYPES.map((type) => {
                    const { icon: Icon, hint } = TYPE_INFO[type];
                    return (
                      <RadioCard
                        key={type}
                        value={type}
                        icon={<Icon />}
                        title={typeTitle(type)}
                        description={hint}
                      />
                    );
                  })}
                </RadioGroup>
              )}
            </FormField>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <FormField
              field={field}
              id="property-description"
              label="Description"
              description={`${field.state.value.trim().length} / 5000 characters · rules, nearby places, who it suits.`}
            >
              {(isInvalid) => (
                <Textarea
                  id="property-description"
                  rows={6}
                  maxLength={5000}
                  placeholder="Describe the home: floor, light, nearby transport and shops, house rules…"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
              )}
            </FormField>
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
