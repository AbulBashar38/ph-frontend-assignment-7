"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { Building2, ImageOff, PlusSquare, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import QueryError from "@/components/shared/query-error";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TableSkeleton from "@/components/shared/table-skeleton";
import UrlPagination from "@/components/shared/url-pagination";
import UrlTabs from "@/components/shared/url-tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { useManagedProperties, useUrlState } from "@/hooks";
import type { ManagedProperty, PropertyStatus } from "@/types";
import { formatCurrency, formatDate, formatEnum, toPositiveInt } from "@/utils";
import PropertyRowActions from "./property-row-actions";

const PATHNAME = "/owner/properties";
const PAGE_SIZE = 10;

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
  { value: "INACTIVE", label: "Hidden" },
  { value: "SUSPENDED", label: "Suspended" },
];

const STATUSES = new Set(STATUS_TABS.map((tab) => tab.value).filter(Boolean));

const columns: DataTableColumn<ManagedProperty>[] = [
  {
    key: "property",
    header: "Property",
    className: "whitespace-normal",
    cell: (property) => (
      <div className="flex min-w-0 items-center gap-3 md:min-w-56">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          {property.images[0] ? (
            <Image
              src={property.images[0].url}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <ImageOff className="absolute inset-0 m-auto size-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`${PATHNAME}/${property.id}`}
            className="line-clamp-2 font-medium hover:text-primary hover:underline md:line-clamp-1"
          >
            {property.title}
          </Link>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {property.area}, {property.city}
          </p>
          {/* Phones have no status column */}
          <StatusBadge status={property.status} className="mt-1 md:hidden" />
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    responsive: "hidden lg:table-cell",
    cell: (property) => formatEnum(property.propertyType),
  },
  {
    key: "rooms",
    header: "Rooms",
    responsive: "hidden md:table-cell",
    cell: (property) => (
      <span className="tabular-nums">
        {property.availableRoomCount} free
        <span className="text-muted-foreground">
          {" "}
          / {property.rooms.length}
        </span>
      </span>
    ),
  },
  {
    key: "rent",
    header: "From",
    responsive: "hidden md:table-cell",
    cell: (property) =>
      property.minAvailableRent !== null ? (
        <span className="tabular-nums">
          {formatCurrency(property.minAvailableRent)}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    responsive: "hidden md:table-cell",
    cell: (property) => (
      <div className="space-y-1">
        <StatusBadge status={property.status} />
        {property.status === "SUSPENDED" && property.moderationNote && (
          <p className="max-w-48 text-xs text-destructive">
            {property.moderationNote}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "updated",
    header: "Updated",
    responsive: "hidden xl:table-cell",
    cell: (property) => (
      <span className="text-muted-foreground">
        {formatDate(property.updatedAt ?? property.createdAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: <span className="sr-only">Actions</span>,
    className: "w-12 text-right",
    cell: (property) => <PropertyRowActions property={property} />,
  },
];

export default function PropertyTable() {
  const { get, clear, searchParams } = useUrlState();
  const searchTerm = get("searchTerm");
  const status = STATUSES.has(get("status"))
    ? (get("status") as PropertyStatus)
    : undefined;
  const page = toPositiveInt(get("page"), 1);
  const filtered = Boolean(searchTerm || status);

  const query = useManagedProperties(
    {
      searchTerm: searchTerm || undefined,
      status,
      page,
      limit: PAGE_SIZE,
      sortBy: "updatedAt",
      sortOrder: "desc",
    },
    { placeholderData: keepPreviousData },
  );

  const toolbar = (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full lg:max-w-sm">
        <SearchInput
          placeholder="Search title, address, area…"
          aria-label="Search your properties"
        />
      </div>
      <UrlTabs label="Filter by status" options={STATUS_TABS} />
    </div>
  );

  if (query.isPending) return <TableSkeleton />;

  if (query.isError) {
    return (
      <div className="space-y-4">
        {toolbar}
        <QueryError error={query.error} onRetry={() => query.refetch()} />
      </div>
    );
  }

  const { data: properties, meta } = query.data;

  return (
    <div className="space-y-4">
      {toolbar}
      <div
        className={
          query.isPlaceholderData ? "opacity-60 transition-opacity" : ""
        }
      >
        <DataTable
          columns={columns}
          rows={properties}
          getRowId={(property) => property.id}
          empty={
            filtered ? (
              <EmptyState
                icon={SearchX}
                title="No properties match"
                description="Try another search term or status."
                action={
                  <Button
                    variant="outline"
                    onClick={() => clear(["searchTerm", "status"])}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={Building2}
                title="You haven't listed a property yet"
                description="Add your first property with photos and rooms, then publish it so tenants can find it."
                action={
                  <Link href={`${PATHNAME}/new`} className={buttonVariants()}>
                    <PlusSquare />
                    Add property
                  </Link>
                }
              />
            )
          }
        />
      </div>
      {meta && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {meta.total} {meta.total === 1 ? "property" : "properties"}
          </p>
          <UrlPagination
            pathname={PATHNAME}
            params={Object.fromEntries(searchParams.entries())}
            page={meta.page}
            totalPages={meta.totalPages}
          />
        </div>
      )}
    </div>
  );
}
