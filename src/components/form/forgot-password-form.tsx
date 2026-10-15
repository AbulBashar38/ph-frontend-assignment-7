"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { forgotPasswordSchema } from "@/validation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: sendCode, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: {
      onChange: forgotPasswordSchema,
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      const email = value.email.trim();

      sendCode(
        { email },
        {
          onSuccess: (res) => {
            toast.success(res.message);
            router.push(`/reset-password?${new URLSearchParams({ email })}`);
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      );
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
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : (
                  <FieldDescription>
                    The email you signed up with. Accounts created with Google
                    don&apos;t have a password to reset.
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner /> Sending code
            </>
          ) : (
            "Send reset code"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
