"use client";

import { useForm } from "@tanstack/react-form";
import type { ReactNode } from "react";
import AmenityPicker from "@/components/shared/amenity-picker";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { RoomType } from "@/types";
import { formatEnum } from "@/utils";
import { ROOM_TYPES, type RoomFormValues, roomSchema } from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

// One room: name, type, rent, capacity, move-in date, amenities (wizard and the property page)
export default function RoomForm({
  defaultValues,
  onSubmit,
  submitLabel,
  pending,
  secondary,
}: {
  defaultValues: RoomFormValues;
  onSubmit: (values: RoomFormValues) => void;
  submitLabel: string;
  pending?: boolean;
  secondary?: ReactNode;
}) {
  const form = useForm({
    defaultValues,
    validators: { onChange: roomSchema, onSubmit: roomSchema },
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
      <FieldGroup className="gap-6">
        <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => (
              <FormField field={field} id="room-name" label="Room name">
                {(isInvalid) => (
                  <Input
                    id="room-name"
                    maxLength={50}
                    placeholder="Master bedroom"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>

          <form.Field name="roomType">
            {(field) => (
              <FormField field={field} id="room-type" label="Room type">
                {(isInvalid) => (
                  <NativeSelect
                    id="room-type"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value as RoomType)
                    }
                    aria-invalid={isInvalid}
                  >
                    <option value="" disabled>
                      Choose a type
                    </option>
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {formatEnum(type)}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              </FormField>
            )}
          </form.Field>

          <form.Field name="monthlyRent">
            {(field) => (
              <FormField field={field} id="room-rent" label="Monthly rent (৳)">
                {(isInvalid) => (
                  <Input
                    id="room-rent"
                    type="number"
                    inputMode="numeric"
                    min={500}
                    step={500}
                    placeholder="12000"
                    value={
                      Number.isNaN(field.state.value) ? "" : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.valueAsNumber)
                    }
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>

          <form.Field name="maxOccupants">
            {(field) => (
              <FormField
                field={field}
                id="room-occupants"
                label="Fits (people)"
              >
                {(isInvalid) => (
                  <Input
                    id="room-occupants"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={20}
                    value={
                      Number.isNaN(field.state.value) ? "" : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.valueAsNumber)
                    }
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>

          <form.Field name="availableFrom">
            {(field) => (
              <FormField
                field={field}
                id="room-available"
                label="Available from"
                optional
                description="Leave empty if it's free now."
                className="sm:col-span-2"
              >
                {(isInvalid) => (
                  <Input
                    id="room-available"
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <FormField
              field={field}
              id="room-description"
              label="About this room"
              optional
            >
              {(isInvalid) => (
                <Textarea
                  id="room-description"
                  rows={3}
                  maxLength={2000}
                  placeholder="Window facing south, attached bathroom, built-in wardrobe…"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
              )}
            </FormField>
          )}
        </form.Field>

        <form.Field name="amenities">
          {(field) => (
            <div className="space-y-3">
              <FieldLabel>Room amenities</FieldLabel>
              <AmenityPicker
                label="Room amenities"
                value={field.state.value}
                onChange={field.handleChange}
              />
            </div>
          )}
        </form.Field>

        <FormActions
          submitLabel={submitLabel}
          pending={pending}
          secondary={secondary}
        />
      </FieldGroup>
    </form>
  );
}
