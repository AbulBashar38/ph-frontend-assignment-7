"use client";

import { Building2, ImageOff, PlusSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListView from "@/components/shared/list-view";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import UrlTabs from "@/components/shared/url-tabs";
import { buttonVariants } from "@/components/ui/button";
import {
  type SortOptions,
  useListParams,
  useManagedProperties,
  useUrlState,
} from "@/hooks";
import type { ManagedProperty, PropertyStatus } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";
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

const STATUSES: PropertyStatus[] = [
  "PUBLISHED",
  "DRAFT",
  "INACTIVE",
  "SUSPENDED",
];

const SORTS: SortOptions = { "": { sortBy: "updatedAt", sortOrder: "desc" } };

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
  const { get } = useUrlState();
  const searchTerm = get("searchTerm") || undefined;
  const { filtered, ...params } = useListParams({
    statuses: STATUSES,
    sorts: SORTS,
  });
  const query = useManagedProperties(
    { ...params, searchTerm, limit: PAGE_SIZE },
    { keepPrevious: true },
  );

  return (
    <ListView
      query={query}
      pathname={PATHNAME}
      noun={["property", "properties"]}
      columns={columns}
      getRowId={(property) => property.id}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <SearchInput
              placeholder="Search title, address, area…"
              aria-label="Search your properties"
            />
          </div>
          <UrlTabs label="Filter by status" options={STATUS_TABS} />
        </div>
      }
      empty={
        filtered || searchTerm ? (
          <FilteredEmptyState
            noun="properties"
            keys={["searchTerm", "status"]}
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
  );
}
