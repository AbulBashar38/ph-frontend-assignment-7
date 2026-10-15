import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import AuthLinks from "@/components/auth/auth-links";
import VerifyAccountForm from "@/components/form/verify-account-form";
import Reveal from "@/components/shared/motion/reveal";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Enter the 6-digit code we emailed you to finish creating your BariBasa account.",
  robots: { index: false },
};

export default function VerifyAccountPage() {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Verify your email"
        description="One last step: confirm it's really you."
      />
      <Reveal delay={0.1}>
        <Suspense fallback={<AuthFormSkeleton fields={1} />}>
          <VerifyAccountForm />
        </Suspense>
      </Reveal>
      <AuthLinks current="verify" delay={0.2} />
    </div>
  );
}
