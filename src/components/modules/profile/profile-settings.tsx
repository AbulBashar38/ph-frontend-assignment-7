"use client";

import { BadgeCheck, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import ChangePasswordForm from "@/components/form/change-password-form";
import ProfileForm from "@/components/form/profile-form";
import SectionCard from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks";
import { formatDate, formatEnum } from "@/utils";
import AvatarUploader from "./avatar-uploader";

export function ProfileSettingsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  );
}

// The signed-in user's own account: photo, details, password (same page for every role)
export default function ProfileSettings() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return <ProfileSettingsSkeleton />;

  const facts = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: ShieldCheck, label: "Account type", value: formatEnum(user.role) },
    {
      icon: BadgeCheck,
      label: "Sign-in",
      value: user.authProvider === "GOOGLE" ? "Google" : "Email & password",
    },
    {
      icon: CalendarDays,
      label: "Member since",
      value: formatDate(user.createdAt),
    },
  ];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <SectionCard title="Profile photo">
          <AvatarUploader user={user} />
        </SectionCard>

        <SectionCard
          title="Personal details"
          description="How you appear to owners, tenants and roommates."
        >
          {/* Keyed so the form picks up the saved values after an update */}
          <ProfileForm key={user.updatedAt} user={user} />
        </SectionCard>

        <SectionCard
          title="Password"
          description={
            user.authProvider === "GOOGLE"
              ? undefined
              : "Changing it signs you out on your other devices."
          }
        >
          {user.authProvider === "GOOGLE" ? (
            <p className="text-sm text-muted-foreground">
              You sign in with Google, so there's no password to change here.
              Manage it in your Google account.
            </p>
          ) : (
            <ChangePasswordForm />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Account" className="lg:sticky lg:top-24">
        <dl className="space-y-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate text-sm font-medium">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </SectionCard>
    </div>
  );
}
