"use client";

import { useForm } from "@tanstack/react-form";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import PasswordInput from "@/components/shared/password-input";
import { FieldGroup } from "@/components/ui/field";
import { useChangePassword } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { changePasswordSchema } from "@/validation";
import FormActions from "./form-actions";
import FormField from "./form-field";

const FIELDS = [
  {
    name: "oldPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    description:
      "8–64 characters with an uppercase and a lowercase letter, a number and a symbol.",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
  },
] as const;

// Signs out every other device; this one stays signed in with fresh tokens
export default function ChangePasswordForm() {
  const { mutate, isPending } = useChangePassword();
  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validators: {
      onChange: changePasswordSchema,
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) =>
      mutate(
        { oldPassword: value.oldPassword, newPassword: value.newPassword },
        {
          onSuccess: () => {
            toast.success("Password changed. Other devices were signed out");
            form.reset();
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      ),
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
        {FIELDS.map(({ name, label, autoComplete, ...rest }) => (
          <form.Field key={name} name={name}>
            {(field) => (
              <FormField
                field={field}
                id={`password-${name}`}
                label={label}
                description={
                  "description" in rest ? rest.description : undefined
                }
              >
                {(isInvalid) => (
                  <PasswordInput
                    id={`password-${name}`}
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
        ))}

        <FormActions
          submitLabel="Change password"
          icon={<KeyRound />}
          pending={isPending}
        />
      </FieldGroup>
    </form>
  );
}
