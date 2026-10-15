import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import AuthLinks from "@/components/auth/auth-links";
import ResetPasswordForm from "@/components/form/reset-password-form";
import Reveal from "@/components/shared/motion/reveal";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Enter the code from your email and choose a new password.",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Set a new password"
        description="Enter the code we emailed you, then choose a new password. You'll be signed out on other devices."
      />
      <Reveal delay={0.1}>
        <Suspense fallback={<AuthFormSkeleton fields={3} />}>
          <ResetPasswordForm />
        </Suspense>
      </Reveal>
      <AuthLinks current="forgot-password" delay={0.2} />
    </div>
  );
}
