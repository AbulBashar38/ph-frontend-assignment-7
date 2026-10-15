"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RoleChoice from "@/components/auth/role-choice";
import GoogleLoginButton from "@/components/modules/google-login/google-login";
import PasswordInput from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRegistration } from "@/hooks";
import type { RegisterRole } from "@/types";
import { getErrorMessage } from "@/utils";
import { registerSchema } from "@/validation";

type TextFieldName = "name" | "email" | "phone";

const TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}[] = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    placeholder: "Your full name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    placeholder: "01712345678",
  },
];

export default function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      // Nothing pre-selected, so nobody becomes a tenant just by not noticing the choice
      role: null as RegisterRole | null,
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onChange: registerSchema, onSubmit: registerSchema },
    onSubmit: ({ value }) => {
      const { confirmPassword: _confirmPassword, role, ...rest } = value;
      // Validation already requires a role; this narrows the type
      if (!role) return;
      const payload = { ...rest, role };

      register(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          const params = new URLSearchParams({ email: payload.email.trim() });
          router.push(`/register/verify-account?${params.toString()}`);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      });
    },
  });

  return (
    <div className="space-y-6">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="role">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>I want to</FieldLabel>
                  <RoleChoice
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {TEXT_FIELDS.map(
            ({ name, label, type, autoComplete, placeholder }) => (
              <form.Field key={name} name={name}>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={type}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            ),
          )}

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : (
                    <FieldDescription>
                      8+ characters with upper and lower case, a number and a
                      symbol.
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Spinner /> Creating account
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>OR</FieldSeparator>

      <form.Subscribe selector={(state) => state.values.role}>
        {/* No role chosen yet: a first-time Google user gets the role popup instead */}
        {(role) => <GoogleLoginButton role={role ?? undefined} />}
      </form.Subscribe>
    </div>
  );
}
