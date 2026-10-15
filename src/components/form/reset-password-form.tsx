"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import PasswordInput from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useCountdown, useForgotPassword, useResetPassword } from "@/hooks";
import { getErrorMessage } from "@/utils";
import { resetPasswordSchema } from "@/validation";

const OTP_LENGTH = 6;
// Matches the backend's resend cooldown (utils/otp.ts)
const RESEND_COOLDOWN_SECONDS = 60;

type PasswordFieldName = "newPassword" | "confirmPassword";

export default function ResetPasswordForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: resendCode, isPending: resending } = useForgotPassword();
  const { remaining: cooldown, restart: restartCooldown } = useCountdown(
    RESEND_COOLDOWN_SECONDS,
  );

  const form = useForm({
    defaultValues: { email, otp: "", newPassword: "", confirmPassword: "" },
    validators: {
      onChange: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      const { confirmPassword: _confirmPassword, ...payload } = value;

      resetPassword(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          router.replace("/login");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      });
    },
  });

  if (!email) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center">
        <p className="font-medium">
          We don&apos;t know which account to reset.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email again and we&apos;ll send you a fresh code.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block font-semibold text-primary hover:underline"
        >
          Back to forgot password
        </Link>
      </div>
    );
  }

  const handleResend = () => {
    resendCode(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          form.setFieldValue("otp", "");
          restartCooldown();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const passwordFields: {
    name: PasswordFieldName;
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "newPassword",
      label: "New password",
      placeholder: "Create a new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      placeholder: "Repeat the new password",
    },
  ];

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex items-start gap-3 rounded-xl bg-accent/60 p-4 text-sm">
        <KeyRound className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          We sent a reset code to{" "}
          <span className="font-semibold break-all">{email}</span>. It expires
          in 5 minutes.{" "}
          <Link
            href="/forgot-password"
            className="font-semibold text-primary hover:underline"
          >
            Wrong email?
          </Link>
        </p>
      </div>

      <FieldGroup>
        <form.Field name="otp">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Reset code</FieldLabel>
                <InputOTP
                  id={field.name}
                  name={field.name}
                  maxLength={OTP_LENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  autoComplete="one-time-code"
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                >
                  <InputOTPGroup>
                    {Array.from(
                      { length: OTP_LENGTH },
                      (_, index) => index,
                    ).map((index) => (
                      <InputOTPSlot key={`slot-${index}`} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {passwordFields.map(({ name, label, placeholder }) => (
          <form.Field key={name} name={name}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    autoComplete="new-password"
                    placeholder={placeholder}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : (
                    name === "newPassword" && (
                      <FieldDescription>
                        8+ characters with upper and lower case, a number and a
                        symbol.
                      </FieldDescription>
                    )
                  )}
                </Field>
              );
            }}
          </form.Field>
        ))}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner /> Resetting password
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </FieldGroup>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get the code?{" "}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>
    </form>
  );
}
