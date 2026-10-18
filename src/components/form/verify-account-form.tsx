"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import {
  useAuthRedirect,
  useCountdown,
  useResendOtp,
  useVerifyEmail,
} from "@/hooks";
import { getErrorMessage } from "@/utils";

const OTP_LENGTH = 6;
// Matches the backend's resend cooldown (utils/otp.ts)
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyAccountForm() {
  const email = useSearchParams().get("email") ?? "";
  const redirectAfterAuth = useAuthRedirect();
  const { mutate: verify, isPending: verifying } = useVerifyEmail();
  const { mutate: resend, isPending: resending } = useResendOtp();

  const [otp, setOtp] = useState("");
  const [showError, setShowError] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);
  const { remaining: cooldown, restart: restartCooldown } = useCountdown(
    RESEND_COOLDOWN_SECONDS,
  );

  if (!email) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center">
        <p className="font-medium">We don&apos;t know which email to verify.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start the sign-up again and we&apos;ll send you a fresh code.
        </p>
        <Link
          href="/register"
          className="mt-4 inline-block font-semibold text-primary hover:underline"
        >
          Back to sign up
        </Link>
      </div>
    );
  }

  // After every verify or resend attempt the boxes start empty; focus returns to them when there's more to type
  const clearOtp = (focus: boolean) => {
    setOtp("");
    setShowError(false);
    if (focus) requestAnimationFrame(() => otpRef.current?.focus());
  };

  const submitOtp = (code: string) => {
    if (code.length !== OTP_LENGTH) {
      setShowError(true);
      return;
    }

    verify(
      { email, otp: code },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          clearOtp(false);
          redirectAfterAuth(res.data.user);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          clearOtp(true);
        },
      },
    );
  };

  const handleResend = () => {
    resend(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          clearOtp(true);
          restartCooldown();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          clearOtp(true);
        },
      },
    );
  };

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitOtp(otp);
      }}
    >
      <div className="flex items-start gap-3 rounded-xl bg-accent/60 p-4 text-sm">
        <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          We sent a 6-digit code to{" "}
          <span className="font-semibold break-all">{email}</span>. It expires
          in 5 minutes.{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Wrong email?
          </Link>
        </p>
      </div>

      <Field data-invalid={showError}>
        <FieldLabel htmlFor="otp">Verification code</FieldLabel>
        <InputOTP
          ref={otpRef}
          id="otp"
          name="otp"
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          autoComplete="one-time-code"
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setShowError(false);
          }}
          onComplete={submitOtp}
          disabled={verifying}
          aria-invalid={showError}
        >
          <InputOTPGroup>
            {Array.from({ length: OTP_LENGTH }, (_, index) => index).map(
              (index) => (
                <InputOTPSlot key={`slot-${index}`} index={index} />
              ),
            )}
          </InputOTPGroup>
        </InputOTP>
        {showError && (
          <FieldError
            errors={[{ message: "Enter all 6 digits of the code" }]}
          />
        )}
      </Field>

      <Button type="submit" disabled={verifying} className="w-full">
        {verifying ? (
          <>
            <Spinner /> Verifying
          </>
        ) : (
          "Verify and continue"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get it?{" "}
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
