"use client";

import { Building2, ImageOff } from "lucide-react";
import Image from "next/image";
import type { DataTableColumn } from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilteredEmptyState from "@/components/shared/filtered-empty-state";
import ListToolbar from "@/components/shared/list-toolbar";
import ListView from "@/components/shared/list-view";
import PersonCell from "@/components/shared/person-cell";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import UrlTabs from "@/components/shared/url-tabs";
import {
  type SortOptions,
  useListParams,
  useManagedProperties,
  useUrlState,
} from "@/hooks";
import type { ManagedProperty, PropertyStatus } from "@/types";
import { formatDate, formatEnum } from "@/utils";
import ModerationActions from "./moderation-actions";

const PATHNAME = "/admin/properties";
const PAGE_SIZE = 10;
const STATUSES: PropertyStatus[] = [
  "PUBLISHED",
  "DRAFT",
  "INACTIVE",
  "SUSPENDED",
];
const SORTS: SortOptions = { "": { sortBy: "createdAt", sortOrder: "desc" } };

const columns: DataTableColumn<ManagedProperty>[] = [
  {
    key: "property",
    header: "Listing",
    className: "whitespace-normal",
    cell: (property) => (
      <div className="flex min-w-56 items-center gap-3">
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
          <p className="line-clamp-1 font-medium">{property.title}</p>
          <p className="text-sm text-muted-foreground">
            {formatEnum(property.propertyType)} · {property.area},{" "}
            {property.city}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "owner",
    header: "Owner",
    responsive: "hidden lg:table-cell",
    cell: (property) =>
      property.owner ? (
        <PersonCell
          name={property.owner.name}
          imageUrl={property.owner.imageUrl}
          detail={property.owner.email}
        />
      ) : (
        "—"
      ),
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
    key: "status",
    header: "Status",
    className: "whitespace-normal",
    cell: (property) => (
      <div className="space-y-1">
        <StatusBadge status={property.status} />
        {property.status === "SUSPENDED" && property.moderationNote && (
          <p
            className="line-clamp-2 max-w-48 text-xs text-muted-foreground"
            title={property.moderationNote}
          >
            {property.moderationNote}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "created",
    header: "Listed",
    responsive: "hidden xl:table-cell",
    cell: (property) => (
      <span className="text-muted-foreground">
        {formatDate(property.createdAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: <span className="sr-only">Actions</span>,
    className: "text-right",
    cell: (property) => <ModerationActions property={property} />,
  },
];

// Every listing on the platform, for moderation (?searchTerm, ?status, ?page)
export default function ModerationTable() {
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
      noun={["listing", "listings"]}
      columns={columns}
      getRowId={(property) => property.id}
      toolbar={
        <ListToolbar
          tabs={
            <UrlTabs
              label="Filter by status"
              options={[
                { value: "", label: "All" },
                { value: "PUBLISHED", label: "Published" },
                { value: "DRAFT", label: "Drafts" },
                { value: "INACTIVE", label: "Hidden" },
                { value: "SUSPENDED", label: "Suspended" },
              ]}
            />
          }
        >
          <div className="sm:w-72">
            <SearchInput
              placeholder="Title, address, area…"
              aria-label="Search listings"
            />
          </div>
        </ListToolbar>
      }
      empty={
        filtered || searchTerm ? (
          <FilteredEmptyState noun="listings" keys={["status", "searchTerm"]} />
        ) : (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Owners' properties appear here once they're created."
          />
        )
      }
    />
  );
}
