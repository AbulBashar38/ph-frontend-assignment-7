"use client";

import { CalendarSearch, SearchX } from "lucide-react";
import Link from "next/link";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import ListFooter from "@/components/shared/list-footer";
import ListToolbar from "@/components/shared/list-toolbar";
import PersonCell from "@/components/shared/person-cell";
import QueryError from "@/components/shared/query-error";
import StatusBadge from "@/components/shared/status-badge";
import TableSkeleton from "@/components/shared/table-skeleton";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import { Button } from "@/components/ui/button";
import {
  useAuth,
  useManagedProperties,
  useUrlState,
  useViewings,
} from "@/hooks";
import type { ViewingListItem, ViewingStatus } from "@/types";
import { formatDateTime, toPositiveInt } from "@/utils";
import ViewingActions from "./viewing-actions";

const PAGE_SIZE = 10;

const STATUS_TABS: { value: "" | ViewingStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "RESCHEDULED", label: "Rescheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];
const STATUSES = new Set<string>(STATUS_TABS.map((tab) => tab.value));

// ?sort values → API sort params
const SORTS = {
  "": { sortBy: "createdAt", sortOrder: "desc" },
  soonest: { sortBy: "preferredAt", sortOrder: "asc" },
} as const;

function columns(isTenant: boolean): DataTableColumn<ViewingListItem>[] {
  return [
    {
      key: "person",
      header: isTenant ? "Owner" : "Tenant",
      cell: (viewing) => {
        const person = isTenant ? viewing.property.owner : viewing.tenant;
        return (
          <PersonCell
            name={person.name}
            imageUrl={person.imageUrl}
            detail={person.phone ?? undefined}
          />
        );
      },
    },
    {
      key: "place",
      header: "Place",
      className: "whitespace-normal",
      cell: (viewing) => (
        <div className="min-w-44">
          <Link
            href={`/properties/${viewing.property.id}`}
            className="line-clamp-1 font-medium hover:text-primary hover:underline"
          >
            {viewing.property.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {viewing.room ? `${viewing.room.name} · ` : "Whole property · "}
            {viewing.property.area}
          </p>
        </div>
      ),
    },
    {
      key: "when",
      header: "When",
      cell: (viewing) => (
        <div>
          <p className="font-medium tabular-nums">
            {formatDateTime(viewing.scheduledAt ?? viewing.preferredAt)}
          </p>
          {viewing.scheduledAt &&
            viewing.scheduledAt !== viewing.preferredAt && (
              <p className="text-xs text-muted-foreground">
                Asked for {formatDateTime(viewing.preferredAt)}
              </p>
            )}
        </div>
      ),
    },
    {
      key: "note",
      header: "Note",
      responsive: "hidden xl:table-cell",
      className: "whitespace-normal",
      cell: (viewing) => {
        const note =
          viewing.ownerNote ?? viewing.cancellationReason ?? viewing.message;
        return note ? (
          <p
            className="line-clamp-2 max-w-60 text-sm text-muted-foreground"
            title={note}
          >
            {note}
          </p>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (viewing) => <StatusBadge status={viewing.status} />,
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (viewing) => <ViewingActions viewing={viewing} />,
    },
  ];
}

// Viewing requests for the signed-in user: owners review them, tenants follow and cancel their own
export default function ViewingTable({ pathname }: { pathname: string }) {
  const { isTenant, isOwner } = useAuth();
  const { get, clear } = useUrlState();
  const status = STATUSES.has(get("status"))
    ? (get("status") as ViewingStatus | "")
    : "";
  const sort = get("sort") === "soonest" ? "soonest" : "";
  const propertyId = get("propertyId");
  const page = toPositiveInt(get("page"), 1);
  const filtered = Boolean(status || propertyId);

  const query = useViewings(
    {
      status: status || undefined,
      propertyId: propertyId || undefined,
      page,
      limit: PAGE_SIZE,
      ...SORTS[sort],
    },
    { keepPrevious: true },
  );
  // Owners can narrow the list to one of their listings
  const properties = useManagedProperties({ limit: 100 }, { enabled: isOwner });

  const toolbar = (
    <ListToolbar
      tabs={<UrlTabs label="Filter by status" options={STATUS_TABS} />}
    >
      {isOwner && (
        <UrlSelect
          urlKey="propertyId"
          label="Filter by property"
          className="sm:w-60"
          options={[
            { value: "", label: "All properties" },
            ...(properties.data?.data ?? []).map((property) => ({
              value: property.id,
              label: property.title,
            })),
          ]}
        />
      )}
      <UrlSelect
        urlKey="sort"
        label="Sort"
        className="sm:w-48"
        options={[
          { value: "", label: "Newest requests" },
          { value: "soonest", label: "Viewing time" },
        ]}
      />
    </ListToolbar>
  );

  if (query.isPending) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {toolbar}
      {query.isError ? (
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      ) : (
        <>
          <div
            className={
              query.isPlaceholderData ? "opacity-60 transition-opacity" : ""
            }
          >
            <DataTable
              columns={columns(isTenant)}
              rows={query.data.data}
              getRowId={(viewing) => viewing.id}
              empty={
                filtered ? (
                  <EmptyState
                    icon={SearchX}
                    title="No viewings match"
                    description="Try another status or property."
                    action={
                      <Button
                        variant="outline"
                        onClick={() => clear(["status", "propertyId"])}
                      >
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={CalendarSearch}
                    title="No viewing requests yet"
                    description={
                      isTenant
                        ? "Found a place you like? Request a viewing from its page."
                        : "When tenants ask to see your places, the requests show up here."
                    }
                    action={
                      isTenant ? (
                        <Button render={<Link href="/properties" />}>
                          Browse properties
                        </Button>
                      ) : undefined
                    }
                  />
                )
              }
            />
          </div>
          <ListFooter
            meta={query.data.meta}
            pathname={pathname}
            noun={["request", "requests"]}
          />
        </>
      )}
    </div>
  );
}
