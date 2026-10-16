"use client";

import { EyeOff, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import QueryError from "@/components/shared/query-error";
import { buttonVariants } from "@/components/ui/button";
import { getErrorStatus } from "@/utils";

// Matches and profiles need your own profile with search switched on; explain which step is missing
export default function RoommateAccessError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const status = getErrorStatus(error);
  const toProfile = (label: string) => (
    <Link href="/dashboard/roommate/profile" className={buttonVariants()}>
      {label}
    </Link>
  );

  if (status === 404) {
    return (
      <EmptyState
        icon={UserRoundPlus}
        title="Create your roommate profile first"
        description="Matches are scored against your budget, area, move-in date and habits."
        action={toProfile("Create profile")}
      />
    );
  }
  if (status === 403) {
    return (
      <EmptyState
        icon={EyeOff}
        title="Your roommate search is paused"
        description="Turn it on to see other tenants. While it's paused, nobody can find you either."
        action={toProfile("Turn search on")}
      />
    );
  }
  return <QueryError error={error} onRetry={onRetry} />;
}
