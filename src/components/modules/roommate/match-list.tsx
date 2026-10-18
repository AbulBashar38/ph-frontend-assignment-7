"use client";

import { SearchX, Users } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import UrlSelect from "@/components/shared/url-select";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSize, useRoommateMatches, useUrlState } from "@/hooks";
import { toPositiveInt } from "@/utils";
import MatchCard from "./match-card";
import RoommateAccessError from "./roommate-access-error";
import { useConnectionState } from "./use-connection-state";

const PAGE_SIZE = 9;
const MIN_SCORES = ["", "50", "70", "85"];

export function MatchListSkeleton() {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {["a", "b", "c"].map((key) => (
        <Skeleton key={key} className="h-80 rounded-2xl" />
      ))}
    </ul>
  );
}

// Best fits first (the API sorts by score); ?minScore and ?page live in the URL
export default function MatchList() {
  const pageSize = usePageSize(PAGE_SIZE);
  const { get, clear } = useUrlState();
  const minScore = MIN_SCORES.includes(get("minScore")) ? get("minScore") : "";
  const page = toPositiveInt(get("page"), 1);
  const query = useRoommateMatches({
    minScore: minScore ? Number(minScore) : undefined,
    page,
    limit: pageSize,
  });
  const stateOf = useConnectionState();

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Scored out of 100 on budget, location, move-in date, lifestyle, smoking,
        pets and sleep.
      </p>
      <UrlSelect
        urlKey="minScore"
        label="Minimum compatibility"
        className="sm:w-52"
        options={[
          { value: "", label: "Any score" },
          { value: "50", label: "50+ compatible" },
          { value: "70", label: "70+ compatible" },
          { value: "85", label: "85+ compatible" },
        ]}
      />
    </div>
  );

  if (query.isPending) {
    return (
      <div className="space-y-4">
        {toolbar}
        <MatchListSkeleton />
      </div>
    );
  }
  if (query.isError) {
    return (
      <RoommateAccessError
        error={query.error}
        onRetry={() => query.refetch()}
      />
    );
  }

  const matches = query.data.data;

  return (
    <div className="space-y-4">
      {toolbar}
      {matches.length === 0 ? (
        minScore ? (
          <EmptyState
            icon={SearchX}
            title="Nobody scores that high yet"
            description="Try a lower minimum score."
            action={
              <button
                type="button"
                className={buttonVariants({ variant: "outline" })}
                onClick={() => clear(["minScore"])}
              >
                Show everyone
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No matches yet"
            description="No other tenant fits your city and gender preference right now. Widening your preferences can help."
            action={
              <Link
                href="/dashboard/roommate/profile"
                className={buttonVariants({ variant: "outline" })}
              >
                Edit preferences
              </Link>
            }
          />
        )
      ) : (
        <ul
          className={
            query.isPlaceholderData
              ? "grid gap-4 opacity-60 transition-opacity md:grid-cols-2 xl:grid-cols-3"
              : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              state={stateOf(match.tenant.id)}
            />
          ))}
        </ul>
      )}
      <ListFooter
        meta={query.data.meta}
        pathname="/dashboard/roommate/matches"
        noun={["match", "matches"]}
      />
    </div>
  );
}
