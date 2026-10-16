"use client";

import { ArrowRight, Eye, EyeOff, UsersRound } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import RoommateProfileForm from "@/components/form/roommate-profile-form";
import QueryError from "@/components/shared/query-error";
import SectionCard from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useMyRoommateProfile, useToggleRoommateSearch } from "@/hooks";
import type { MyRoommateProfile } from "@/types";
import { getErrorMessage } from "@/utils";

export function RoommateProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-[36rem] rounded-2xl" />
    </div>
  );
}

// Visible in matches or paused; flips instantly (optimistic) and rolls back on error
function SearchStatus({ profile }: { profile: MyRoommateProfile }) {
  const toggle = useToggleRoommateSearch();
  const Icon = profile.isActive ? Eye : EyeOff;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <label
            htmlFor="roommate-search"
            className="font-heading font-semibold"
          >
            {profile.isActive
              ? "Roommate search is on"
              : "Roommate search is paused"}
          </label>
          <p className="text-sm text-muted-foreground">
            {profile.isActive
              ? "Other tenants can find you, and you can browse your matches."
              : "You're hidden from matches. Turn it on to browse and be found."}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {profile.isActive && (
          <Link
            href="/dashboard/roommate/matches"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            See matches
            <ArrowRight />
          </Link>
        )}
        <Switch
          id="roommate-search"
          checked={profile.isActive}
          onCheckedChange={(isActive) =>
            toggle.mutate(isActive, {
              onSuccess: () =>
                toast.success(
                  isActive ? "Roommate search is on" : "Roommate search paused",
                ),
              onError: (error) => toast.error(getErrorMessage(error)),
            })
          }
        />
      </div>
    </section>
  );
}

// The tenant's roommate profile: create it the first time, then edit it and pause or resume the search
export default function RoommateProfileManager() {
  const query = useMyRoommateProfile();

  if (query.isPending) return <RoommateProfileSkeleton />;
  if (query.isError) {
    return <QueryError error={query.error} onRetry={() => query.refetch()} />;
  }

  const profile = query.data;

  return (
    <div className="space-y-6">
      {profile ? (
        <SearchStatus profile={profile} />
      ) : (
        <section className="flex gap-4 rounded-2xl border border-primary/20 bg-accent/40 p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
            <UsersRound className="size-5" />
          </span>
          <div>
            <h2 className="font-heading font-semibold">
              Find someone to share with
            </h2>
            <p className="text-sm text-muted-foreground">
              Tell us your budget, area and habits. We score every other tenant
              out of 100 on budget, location, move-in date and lifestyle, so the
              best fits come first.
            </p>
          </div>
        </section>
      )}

      <SectionCard
        title={
          profile ? "Your roommate profile" : "Create your roommate profile"
        }
        description="Only tenants who are looking for a roommate can see it."
      >
        {/* Keyed so the form shows the saved values after an update */}
        <RoommateProfileForm
          key={profile?.updatedAt ?? "new"}
          profile={profile}
        />
      </SectionCard>
    </div>
  );
}
