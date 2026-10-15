import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import AuthLinks from "@/components/auth/auth-links";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import Reveal from "@/components/shared/motion/reveal";

export const metadata: Metadata = {
  title: "Forgot password",
  description:
    "Reset your BariBasa password. We'll email you a code to set a new one.",
  openGraph: {
    title: "Reset your BariBasa password",
    description: "Get a code by email and set a new password.",
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Forgot your password?"
        description="No problem. Enter your email and we'll send you a code to reset it."
      />
      <Reveal delay={0.1}>
        <Suspense fallback={<AuthFormSkeleton fields={1} />}>
          <ForgotPasswordForm />
        </Suspense>
      </Reveal>
      <AuthLinks current="forgot-password" delay={0.2} />
    </div>
  );
}
