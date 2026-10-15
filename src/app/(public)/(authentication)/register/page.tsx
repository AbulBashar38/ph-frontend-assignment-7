import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import RegisterForm from "@/components/form/register-form";

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

      <Suspense fallback={<AuthFormSkeleton fields={6} />}>
        <RegisterForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
