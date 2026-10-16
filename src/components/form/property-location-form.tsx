"use client";

import { useForm } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type PropertyLocationValues,
  propertyLocationSchema,
} from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

const FIELDS = [
  {
    name: "address",
    label: "Street address",
    placeholder: "House 12, Road 5",
    description:
      "Shared with tenants once you approve a viewing or application.",
  },
  {
    name: "area",
    label: "Area",
    placeholder: "Dhanmondi",
    description: "Tenants search by area, so use the common name.",
  },
  { name: "city", label: "City", placeholder: "Dhaka" },
] as const;

// Where the listing is (wizard step 2 and the edit page)
export default function PropertyLocationForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitIcon,
  pending,
  secondary,
}: {
  defaultValues: PropertyLocationValues;
  onSubmit: (values: PropertyLocationValues) => void;
  submitLabel: string;
  submitIcon?: ReactNode;
  pending?: boolean;
  secondary?: ReactNode;
}) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: propertyLocationSchema,
      onSubmit: propertyLocationSchema,
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
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2">
          {FIELDS.map(({ name, label, placeholder, ...rest }) => (
            <form.Field key={name} name={name}>
              {(field) => (
                <FormField
                  field={field}
                  id={`property-${name}`}
                  label={label}
                  description={
                    "description" in rest ? rest.description : undefined
                  }
                  className={name === "address" ? "sm:col-span-2" : undefined}
                >
                  {(isInvalid) => (
                    <Input
                      id={`property-${name}`}
                      placeholder={placeholder}
                      autoComplete={
                        name === "address" ? "street-address" : "off"
                      }
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
          ))}
        </div>

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
