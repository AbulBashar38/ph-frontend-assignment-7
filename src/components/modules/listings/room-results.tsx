import { SearchX } from "lucide-react";
import Link from "next/link";
import { searchRooms } from "@/api/public.server";
import EmptyState from "@/components/shared/empty-state";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import PaginationBar from "@/components/shared/pagination-bar";
import RoomCard from "@/components/shared/room-card";
import { buttonVariants } from "@/components/ui/button";
import type { PublicRoomQueryParams } from "@/types";
import {
  pickSearchParams,
  type RawSearchParams,
  toPageSize,
  toPositiveInt,
} from "@/utils";
import ResultsHeader from "./results-header";
import type { SortOption } from "./sort-select";

const PAGE_SIZE = 12;

// Exactly what GET /room/public/available-rooms accepts
const ALLOWED_KEYS = [
  "limit",
  "searchTerm",
  "city",
  "area",
  "propertyType",
  "roomType",
  "minRent",
  "maxRent",
  "occupants",
  "amenities",
  "sortBy",
  "sortOrder",
  "page",
] as const;

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Rent: low to high", sortBy: "monthlyRent", sortOrder: "asc" },
  { label: "Rent: high to low", sortBy: "monthlyRent", sortOrder: "desc" },
  { label: "Available soonest", sortBy: "availableFrom", sortOrder: "asc" },
];

// Server component: reads the URL, fetches matching rooms and renders the results
export default async function RoomResults({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = pickSearchParams(await searchParams, ALLOWED_KEYS);
  const page = toPositiveInt(params.page, 1);

  const { items, meta } = await searchRooms({
    ...params,
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder === "asc" ? "asc" : "desc",
    page,
    limit: toPageSize(params.limit, PAGE_SIZE),
  } as PublicRoomQueryParams);

  const hasFilters = Object.keys(params).some(
    (key) => !["sortBy", "sortOrder", "page", "limit"].includes(key),
  );

  return (
    <div className="space-y-6">
      <ResultsHeader
        meta={meta}
        noun={["room", "rooms"]}
        sortOptions={SORT_OPTIONS}
      />

      {items.length > 0 ? (
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((room, index) => (
            <StaggerItem key={room.id}>
              <RoomCard room={room} priority={index < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          icon={SearchX}
          title={
            hasFilters
              ? "No rooms match these filters"
              : "No rooms available yet"
          }
          description={
            hasFilters
              ? "Try a wider rent range, another area or fewer amenities."
              : "Rooms appear here as soon as owners make them available."
          }
          action={
            hasFilters ? (
              <Link
                href="/rooms"
                className={buttonVariants({ variant: "outline" })}
              >
                Clear all filters
              </Link>
            ) : (
              <Link href="/properties" className={buttonVariants()}>
                Browse whole properties
              </Link>
            )
          }
        />
      )}

      <PaginationBar
        meta={meta}
        pathname="/rooms"
        params={params}
        summary={`${meta.total} ${meta.total === 1 ? "room" : "rooms"} found`}
      />
    </div>
  );
}
