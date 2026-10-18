"use client";

import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useUpdateProfile } from "@/hooks";
import type { Gender, UpdateProfilePayload, User } from "@/types";
import { getErrorMessage } from "@/utils";
import { profileSchema } from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

const GENDERS: { value: Gender; label: string }[] = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "OTHER", label: "Other" },
];

// Name and phone for everyone; occupation and gender for tenants (roommate matching); address for owners
export default function ProfileForm({ user }: { user: User }) {
  const { mutateAsync, isPending } = useUpdateProfile();
  const isTenant = user.role === "TENANT";
  const isOwner = user.role === "OWNER";

  const form = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      occupation: user.occupation ?? "",
      gender: (user.gender ?? "") as Gender | "",
      address: user.address ?? "",
    },
    validators: { onChange: profileSchema, onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const payload: UpdateProfilePayload = {
        name: value.name.trim(),
        // The backend can't clear a phone number, so an empty box leaves it unchanged
        phone: value.phone.trim() || undefined,
        ...(isTenant && {
          occupation: value.occupation.trim() || null,
          gender: value.gender || null,
        }),
        ...(isOwner && { address: value.address.trim() || null }),
      };
      // Awaited so the toast shows even though the form remounts with the saved values
      try {
        await mutateAsync({ id: user.id, payload });
        toast.success("Profile saved");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
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
              <FormField field={field} id="profile-name" label="Full name">
                {(isInvalid) => (
                  <Input
                    id="profile-name"
                    autoComplete="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <FormField
                field={field}
                id="profile-phone"
                label="Phone"
                description="Shared with the other side once a viewing or application is accepted."
              >
                {(isInvalid) => (
                  <Input
                    id="profile-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                )}
              </FormField>
            )}
          </form.Field>

          {isTenant && (
            <>
              <form.Field name="occupation">
                {(field) => (
                  <FormField
                    field={field}
                    id="profile-occupation"
                    label="Occupation"
                    optional
                  >
                    {(isInvalid) => (
                      <Input
                        id="profile-occupation"
                        placeholder="e.g. Software engineer, student"
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
              <form.Field name="gender">
                {(field) => (
                  <FormField
                    field={field}
                    id="profile-gender"
                    label="Gender"
                    optional
                    description="Used for roommate matching."
                  >
                    {(isInvalid) => (
                      <NativeSelect
                        id="profile-gender"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value as Gender | "")
                        }
                        aria-invalid={isInvalid}
                      >
                        <option value="">Prefer not to say</option>
                        {GENDERS.map((gender) => (
                          <option key={gender.value} value={gender.value}>
                            {gender.label}
                          </option>
                        ))}
                      </NativeSelect>
                    )}
                  </FormField>
                )}
              </form.Field>
            </>
          )}

          {isOwner && (
            <form.Field name="address">
              {(field) => (
                <FormField
                  field={field}
                  id="profile-address"
                  label="Business or mailing address"
                  optional
                  className="sm:col-span-2"
                >
                  {(isInvalid) => (
                    <Input
                      id="profile-address"
                      autoComplete="street-address"
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
          )}
        </div>

        <FormActions
          submitLabel="Save profile"
          icon={<Save />}
          pending={isPending}
        />
      </FieldGroup>
    </form>
  );
}
