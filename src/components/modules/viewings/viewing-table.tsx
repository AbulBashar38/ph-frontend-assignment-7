"use client";

import { CalendarSearch } from "lucide-react";
import Link from "next/link";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListToolbar from "@/components/shared/list-toolbar";
import ListView from "@/components/shared/list-view";
import PersonCell from "@/components/shared/person-cell";
import PropertyFilter from "@/components/shared/property-filter";
import StatusBadge from "@/components/shared/status-badge";
import UrlSelect from "@/components/shared/url-select";
import UrlTabs from "@/components/shared/url-tabs";
import { Button } from "@/components/ui/button";
import {
  type SortOptions,
  useAuth,
  useListParams,
  usePageSize,
  useViewings,
} from "@/hooks";
import type { ViewingListItem, ViewingStatus } from "@/types";
import { formatDateTime } from "@/utils";
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
const STATUSES = STATUS_TABS.map((tab) => tab.value).filter(
  (value): value is ViewingStatus => value !== "",
);

// ?sort values → API sort params
const SORTS: SortOptions = {
  "": { sortBy: "createdAt", sortOrder: "desc" },
  soonest: { sortBy: "preferredAt", sortOrder: "asc" },
};

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
  const pageSize = usePageSize(PAGE_SIZE);
  const { isTenant } = useAuth();
  const { filtered, ...params } = useListParams({
    statuses: STATUSES,
    sorts: SORTS,
  });
  const query = useViewings(
    { ...params, limit: pageSize },
    { keepPrevious: true },
  );

  return (
    <ListView
      query={query}
      pathname={pathname}
      noun={["request", "requests"]}
      columns={columns(isTenant)}
      getRowId={(viewing) => viewing.id}
      toolbar={
        <ListToolbar
          tabs={<UrlTabs label="Filter by status" options={STATUS_TABS} />}
        >
          <PropertyFilter />
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
      }
      empty={
        filtered ? (
          <FilteredEmptyState noun="viewings" keys={["status", "propertyId"]} />
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
  );
}
