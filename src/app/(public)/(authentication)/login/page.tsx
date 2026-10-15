import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import AuthHeading from "@/components/auth/auth-heading";
import AuthLinks from "@/components/auth/auth-links";
import DemoLogin, { type DemoAccount } from "@/components/auth/demo-login";
import LoginForm from "@/components/form/login-form";
import GoogleLoginButton from "@/components/modules/google-login/google-login";
import Reveal from "@/components/shared/motion/reveal";
import { FieldSeparator } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to BariBasa to manage your listings, viewings, applications, roommate matches and rent payments.",
  openGraph: {
    title: "Log in to BariBasa",
    description:
      "Manage listings, viewings, applications and rent payments in one place.",
  },
};

// Dedicated demo accounts for evaluators (public on purpose; see .env.example)
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "admin",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
  },
  {
    role: "tenant",
    email: process.env.NEXT_PUBLIC_DEMO_TENANT_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_TENANT_PASSWORD,
  },
  {
    role: "owner",
    email: process.env.NEXT_PUBLIC_DEMO_OWNER_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_OWNER_PASSWORD,
  },
];

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <AuthHeading
        title="Welcome back"
        description="Log in to your account to continue."
      />

      <Reveal delay={0.1}>
        <Suspense fallback={<AuthFormSkeleton />}>
          <LoginForm />
          <div className="mt-4">
            <GoogleLoginButton />
          </div>
        </Suspense>
      </Reveal>

      <Reveal delay={0.2} className="space-y-8">
        <FieldSeparator>OR</FieldSeparator>

        <section
          id="demo-login"
          aria-labelledby="demo-login-title"
          className="space-y-4"
        >
          <div>
            <h2
              id="demo-login-title"
              className="font-heading text-lg font-semibold"
            >
              Quick demo login
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore the platform instantly as any role.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            }
          >
            <DemoLogin accounts={DEMO_ACCOUNTS} />
          </Suspense>
        </section>
      </Reveal>

      <AuthLinks current="login" delay={0.3} />
    </div>
  );
}
