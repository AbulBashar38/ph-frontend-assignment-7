"use client";

import { CalendarDays, MapPin, Wallet } from "lucide-react";
import Link from "next/link";
import PersonCell from "@/components/shared/person-cell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { RoommateMatch } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import CompatibilityScore from "./compatibility-score";
import ConnectButton from "./connect-button";
import { lifestyleOption, SLEEP_LABELS } from "./roommate-labels";
import type { ConnectionState } from "./use-connection-state";

// One match in the grid: who, the score, the essentials and the next step
export default function MatchCard({
  match,
  state,
}: {
  match: RoommateMatch;
  state: ConnectionState;
}) {
  const { tenant } = match;
  const details = [
    tenant.occupation,
    `${match.age}`,
    tenant.gender &&
      tenant.gender.charAt(0) + tenant.gender.slice(1).toLowerCase(),
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <PersonCell
          name={tenant.name}
          imageUrl={tenant.imageUrl}
          detail={details.join(" · ")}
        />
        <CompatibilityScore
          score={match.compatibility.score}
          label={match.compatibility.label}
        />
      </div>

      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Wallet className="size-4 shrink-0 text-primary" />
          {formatCurrency(match.budgetMin)} – {formatCurrency(match.budgetMax)}
          /month
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" />
          {match.preferredArea
            ? `${match.preferredArea}, ${match.preferredCity}`
            : match.preferredCity}
        </li>
        <li className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          Moving in {formatDate(match.moveInDate)} ·{" "}
          {SLEEP_LABELS[match.sleepSchedule]}
        </li>
      </ul>

      {match.lifestyle.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Lifestyle">
          {match.lifestyle.slice(0, 4).map((tag) => {
            const { label, icon: Icon } = lifestyleOption(tag);
            return (
              <li key={tag}>
                <Badge variant="muted">
                  <Icon />
                  {label}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
        <Link
          href={`/dashboard/roommate/profile/${match.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View profile
        </Link>
        <ConnectButton state={state} profileId={match.id} name={tenant.name} />
      </div>
    </li>
  );
}
