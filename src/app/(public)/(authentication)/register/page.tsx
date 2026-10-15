import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import RegisterForm from "@/components/form/register-form";
import Reveal from "@/components/shared/motion/reveal";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Sign up for BariBasa as a tenant to find rooms and roommates, or as an owner to list your property.",
  openGraph: {
    title: "Join BariBasa",
    description:
      "Find rooms and compatible roommates, or list your property for free.",
  },
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Create your account"
        description="It's free. We'll email you a code to verify your address."
      />

      <Reveal delay={0.1}>
        <Suspense fallback={<AuthFormSkeleton fields={6} />}>
          <RegisterForm />
        </Suspense>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
