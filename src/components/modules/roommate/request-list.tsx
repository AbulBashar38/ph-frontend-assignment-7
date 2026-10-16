"use client";

import { Inbox, Send } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import ListToolbar from "@/components/shared/list-toolbar";
import QueryError from "@/components/shared/query-error";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoommateRequests, useUrlState } from "@/hooks";
import type { RoommateRequestStatus } from "@/types";
import { toPositiveInt } from "@/utils";
import RequestCard from "./request-card";

const PAGE_SIZE = 10;
const STATUSES: RoommateRequestStatus[] = [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "CANCELLED",
];

export function RequestListSkeleton() {
  return (
    <div className="space-y-3">
      {["a", "b", "c"].map((key) => (
        <Skeleton key={key} className="h-36 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// Received (default) or sent requests: ?type=sent, ?status and ?page in the URL
export default function RequestList() {
  const { get } = useUrlState();
  const direction = get("type") === "sent" ? "sent" : "received";
  const status = STATUSES.find((value) => value === get("status"));
  const page = toPositiveInt(get("page"), 1);
  const query = useRoommateRequests({
    type: direction,
    status,
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const toolbar = (
    <ListToolbar
      tabs={
        <UrlTabs
          urlKey="type"
          label="Requests"
          options={[
            { value: "", label: "Received" },
            { value: "sent", label: "Sent" },
          ]}
        />
      }
    >
      <UrlSelect
        urlKey="status"
        label="Filter by status"
        className="sm:w-48"
        options={[
          { value: "", label: "Any status" },
          { value: "PENDING", label: "Waiting" },
          { value: "ACCEPTED", label: "Accepted" },
          { value: "DECLINED", label: "Declined" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
      />
    </ListToolbar>
  );

  let content: React.ReactNode;
  if (query.isPending) content = <RequestListSkeleton />;
  else if (query.isError) {
    content = (
      <QueryError error={query.error} onRetry={() => query.refetch()} />
    );
  } else if (query.data.data.length === 0) {
    content = (
      <EmptyState
        icon={direction === "sent" ? Send : Inbox}
        title={
          direction === "sent"
            ? "You haven't sent any requests"
            : "No requests yet"
        }
        description={
          direction === "sent"
            ? "Find someone who fits and ask to connect."
            : "When another tenant asks to connect, it shows up here."
        }
        action={
          <Link
            href="/dashboard/roommate/matches"
            className={buttonVariants({ variant: "outline" })}
          >
            See matches
          </Link>
        }
      />
    );
  } else {
    content = (
      <ul
        className={
          query.isPlaceholderData
            ? "space-y-3 opacity-60 transition-opacity"
            : "space-y-3"
        }
      >
        {query.data.data.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            direction={direction}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {toolbar}
      {content}
      {query.data && (
        <ListFooter
          meta={query.data.meta}
          pathname="/dashboard/roommate/requests"
          noun={["request", "requests"]}
        />
      )}
    </div>
  );
}
