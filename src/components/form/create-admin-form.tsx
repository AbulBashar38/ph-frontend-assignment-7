"use client";

import { useForm } from "@tanstack/react-form";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import PasswordInput from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateAdmin } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { createAdminSchema } from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

// A new ADMIN account (SUPER_ADMIN only); it can sign in right away with this password
export default function CreateAdminForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending } = useCreateAdmin();
  const form = useForm({
    defaultValues: { name: "", email: "", phone: "", password: "" },
    validators: { onChange: createAdminSchema, onSubmit: createAdminSchema },
    onSubmit: ({ value }) =>
      mutate(
        {
          name: value.name.trim(),
          email: value.email.trim().toLowerCase(),
          phone: value.phone.trim() || undefined,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success(`${value.name.trim()} is now an admin`);
            onDone();
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      ),
  });

  const text = (
    name: "name" | "email" | "phone",
    label: string,
    type: string,
    autoComplete: string,
    optional = false,
  ) => (
    <form.Field name={name}>
      {(field) => (
        <FormField
          field={field}
          id={`admin-${name}`}
          label={label}
          optional={optional}
        >
          {(isInvalid) => (
            <Input
              id={`admin-${name}`}
              type={type}
              autoComplete={autoComplete}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
            />
          )}
        </FormField>
      )}
    </form.Field>
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-6">
        {text("name", "Full name", "text", "off")}
        {text("email", "Email", "email", "off")}
        {text("phone", "Phone", "tel", "off", true)}
        <form.Field name="password">
          {(field) => (
            <FormField
              field={field}
              id="admin-password"
              label="Temporary password"
              description="Share it privately; they can change it from their profile."
            >
              {(isInvalid) => (
                <PasswordInput
                  id="admin-password"
                  autoComplete="new-password"
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
          submitLabel="Create admin"
          pendingLabel="Creating"
          icon={<UserPlus />}
          pending={isPending}
          secondary={
            <Button type="button" variant="ghost" onClick={onDone}>
              Cancel
            </Button>
          }
        />
      </FieldGroup>
    </form>
  );
}
