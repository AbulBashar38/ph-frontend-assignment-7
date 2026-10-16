"use client";

import { KeyRound } from "lucide-react";
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
import { type SortOptions, useAuth, useListParams, useRentals } from "@/hooks";
import type { Rental, RentalStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import RentalActions from "./rental-actions";

const PAGE_SIZE = 10;

const STATUS_TABS: { value: "" | RentalStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Awaiting first rent" },
  { value: "COMPLETED", label: "Finished" },
  { value: "TERMINATED", label: "Ended early" },
];
const STATUSES = STATUS_TABS.map((tab) => tab.value).filter(
  (value): value is RentalStatus => value !== "",
);

const SORTS: SortOptions = {
  "": { sortBy: "createdAt", sortOrder: "desc" },
  start: { sortBy: "startDate", sortOrder: "asc" },
  rent: { sortBy: "monthlyRent", sortOrder: "desc" },
};

function columns(isTenant: boolean): DataTableColumn<Rental>[] {
  return [
    {
      key: "person",
      header: isTenant ? "Owner" : "Tenant",
      cell: (rental) => {
        const person = isTenant ? rental.owner : rental.tenant;
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
      key: "room",
      header: "Room",
      className: "whitespace-normal",
      cell: (rental) => (
        <div className="min-w-44">
          <p className="line-clamp-1 font-medium">{rental.room.name}</p>
          <Link
            href={`/properties/${rental.property.id}`}
            className="line-clamp-1 text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            {rental.property.title}
          </Link>
        </div>
      ),
    },
    {
      key: "rent",
      header: "Rent",
      cell: (rental) => (
        <div>
          <p className="font-medium tabular-nums">
            {formatCurrency(rental.monthlyRent)}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {rental.occupants} {rental.occupants === 1 ? "person" : "people"}
          </p>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      responsive: "hidden md:table-cell",
      cell: (rental) => (
        <p className="tabular-nums">
          {formatDate(rental.startDate)}
          <span className="text-muted-foreground">
            {" "}
            → {rental.endDate ? formatDate(rental.endDate) : "ongoing"}
          </span>
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "whitespace-normal",
      cell: (rental) => (
        <div className="space-y-1">
          <StatusBadge status={rental.status} />
          {rental.terminationReason && (
            <p
              className="line-clamp-2 max-w-48 text-xs text-muted-foreground"
              title={rental.terminationReason}
            >
              {rental.terminationReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (rental) => <RentalActions rental={rental} />,
    },
  ];
}

// Rentals the signed-in user is part of: owners see their tenants, tenants their homes
export default function RentalTable({ pathname }: { pathname: string }) {
  const { isTenant } = useAuth();
  const { filtered, ...params } = useListParams({
    statuses: STATUSES,
    sorts: SORTS,
  });
  const query = useRentals(
    { ...params, limit: PAGE_SIZE },
    { keepPrevious: true },
  );

  return (
    <ListView
      query={query}
      pathname={pathname}
      noun={["rental", "rentals"]}
      columns={columns(isTenant)}
      getRowId={(rental) => rental.id}
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
              { value: "", label: "Newest first" },
              { value: "start", label: "Start date" },
              { value: "rent", label: "Highest rent" },
            ]}
          />
        </ListToolbar>
      }
      empty={
        filtered ? (
          <FilteredEmptyState noun="rentals" keys={["status", "propertyId"]} />
        ) : (
          <EmptyState
            icon={KeyRound}
            title="No rentals yet"
            description={
              isTenant
                ? "Once an owner approves your application, your rental shows up here."
                : "Approve an application and the rental starts here, waiting for the first rent."
            }
            action={
              isTenant ? (
                <Button render={<Link href="/rooms" />}>Browse rooms</Button>
              ) : (
                <Button render={<Link href="/owner/applications" />}>
                  Review applications
                </Button>
              )
            }
          />
        )
      }
    />
  );
}
