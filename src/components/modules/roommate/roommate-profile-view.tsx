"use client";

import {
  ArrowLeft,
  CalendarDays,
  Cigarette,
  MapPin,
  Moon,
  PawPrint,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import SectionCard from "@/components/shared/section-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoommateProfile } from "@/hooks";
import type { CompatibilityPart } from "@/types";
import { formatCurrency, formatDate, getInitials } from "@/utils";
import CompatibilityScore from "./compatibility-score";
import ConnectButton from "./connect-button";
import RoommateAccessError from "./roommate-access-error";
import {
  GENDER_LABELS,
  lifestyleOption,
  PART_LABELS,
  PET_LABELS,
  SLEEP_LABELS,
  SMOKING_LABELS,
} from "./roommate-labels";
import { useConnectionState } from "./use-connection-state";

export function RoommateProfileViewSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Skeleton className="h-[30rem] rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

// Another tenant's roommate profile with how well they fit you, part by part
export default function RoommateProfileView({ id }: { id: string }) {
  const query = useRoommateProfile(id);
  const stateOf = useConnectionState();

  if (query.isPending) return <RoommateProfileViewSkeleton />;
  if (query.isError) {
    return (
      <RoommateAccessError
        error={query.error}
        onRetry={() => query.refetch()}
      />
    );
  }

  const profile = query.data.data;
  const { tenant, compatibility } = profile;
  const facts = [
    {
      icon: Wallet,
      label: "Budget",
      value: `${formatCurrency(profile.budgetMin)} – ${formatCurrency(profile.budgetMax)} a month`,
    },
    {
      icon: MapPin,
      label: "Looking in",
      value: profile.preferredArea
        ? `${profile.preferredArea}, ${profile.preferredCity}`
        : profile.preferredCity,
    },
    {
      icon: CalendarDays,
      label: "Move-in",
      value: formatDate(profile.moveInDate),
    },
    { icon: Moon, label: "Sleep", value: SLEEP_LABELS[profile.sleepSchedule] },
    {
      icon: Cigarette,
      label: "Smoking",
      value: SMOKING_LABELS[profile.smokingPreference],
    },
    { icon: PawPrint, label: "Pets", value: PET_LABELS[profile.petPreference] },
    {
      icon: Users,
      label: "Roommate",
      value: profile.genderPreference
        ? `${GENDER_LABELS[profile.genderPreference]} only`
        : "Anyone",
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/roommate/matches"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All matches
      </Link>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-6 rounded-2xl border bg-card p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                {tenant.imageUrl && (
                  <AvatarImage src={tenant.imageUrl} alt="" />
                )}
                <AvatarFallback className="bg-accent font-heading text-2xl font-semibold text-primary">
                  {getInitials(tenant.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                  {tenant.name}
                </h1>
                <p className="text-muted-foreground">
                  {[
                    `${profile.age}`,
                    tenant.gender && GENDER_LABELS[tenant.gender],
                    tenant.occupation,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
            <ConnectButton
              state={stateOf(tenant.id)}
              profileId={profile.id}
              name={tenant.name}
              size="default"
            />
          </div>

          {profile.bio && (
            <p className="whitespace-pre-line leading-relaxed">{profile.bio}</p>
          )}

          <dl className="grid gap-4 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {profile.lifestyle.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Lifestyle
              </h2>
              <ul className="flex flex-wrap gap-2">
                {profile.lifestyle.map((tag) => {
                  const { label, icon: Icon } = lifestyleOption(tag);
                  return (
                    <li key={tag}>
                      <Badge variant="muted" size="default">
                        <Icon />
                        {label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        <SectionCard title="How you fit" className="lg:sticky lg:top-24">
          <div className="space-y-6">
            <div className="flex justify-center">
              <CompatibilityScore
                score={compatibility.score}
                label={compatibility.label}
                size="lg"
              />
            </div>
            <ul className="space-y-4">
              {(
                Object.entries(compatibility.breakdown) as [
                  CompatibilityPart,
                  { score: number; max: number; label: string },
                ][]
              ).map(([part, result]) => (
                <li key={part} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{PART_LABELS[part]}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {result.score} / {result.max}
                    </span>
                  </div>
                  <Progress
                    value={(result.score / result.max) * 100}
                    aria-label={`${PART_LABELS[part]}: ${result.score} of ${result.max}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
