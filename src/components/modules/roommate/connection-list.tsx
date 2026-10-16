"use client";

import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import PersonCell from "@/components/shared/person-cell";
import QueryError from "@/components/shared/query-error";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoommateConnections, useUrlState } from "@/hooks";
import { formatDate, toPositiveInt } from "@/utils";
import ContactLinks from "./contact-links";

const PAGE_SIZE = 12;

export function ConnectionListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {["a", "b"].map((key) => (
        <Skeleton key={key} className="h-44 rounded-2xl" />
      ))}
    </div>
  );
}

// People who accepted (or whose request I accepted), with their contact details
export default function ConnectionList() {
  const { get } = useUrlState();
  const page = toPositiveInt(get("page"), 1);
  const query = useRoommateConnections({ page, limit: PAGE_SIZE });

  if (query.isPending) return <ConnectionListSkeleton />;
  if (query.isError) {
    return <QueryError error={query.error} onRetry={() => query.refetch()} />;
  }
  if (query.data.data.length === 0) {
    return (
      <EmptyState
        icon={HeartHandshake}
        title="No connections yet"
        description="When someone accepts your request (or you accept theirs), you'll find their email and phone here."
        action={
          <Link href="/dashboard/roommate/matches" className={buttonVariants()}>
            Find a roommate
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="grid gap-4 md:grid-cols-2">
        {query.data.data.map(({ roommateRequestId, connectedAt, user }) => (
          <li
            key={roommateRequestId}
            className="space-y-4 rounded-2xl border bg-card p-5"
          >
            <PersonCell
              name={user.name}
              imageUrl={user.imageUrl}
              detail={
                connectedAt
                  ? `Connected ${formatDate(connectedAt)}`
                  : (user.occupation ?? undefined)
              }
            />
            <ContactLinks person={user} />
            {user.roommateProfile && (
              <Link
                href={`/dashboard/roommate/profile/${user.roommateProfile.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View profile
              </Link>
            )}
          </li>
        ))}
      </ul>
      <ListFooter
        meta={query.data.meta}
        pathname="/dashboard/roommate/connections"
        noun={["connection", "connections"]}
      />
    </div>
  );
}
