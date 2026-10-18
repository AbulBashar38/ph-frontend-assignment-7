import { SearchX } from "lucide-react";
import Link from "next/link";
import { searchProperties } from "@/api/public.server";
import EmptyState from "@/components/shared/empty-state";
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger";
import PaginationBar from "@/components/shared/pagination-bar";
import PropertyCard from "@/components/shared/property-card";
import { buttonVariants } from "@/components/ui/button";
import type { PublicPropertyQueryParams } from "@/types";
import {
  pickSearchParams,
  type RawSearchParams,
  toPageSize,
  toPositiveInt,
} from "@/utils";
import ResultsHeader from "./results-header";
import type { SortOption } from "./sort-select";

const PAGE_SIZE = 12;

// Exactly what GET /property/public/all-properties accepts
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
  "availableOnly",
  "sortBy",
  "sortOrder",
  "page",
] as const;

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest first", sortBy: "newest", sortOrder: "desc" },
  { label: "Rent: low to high", sortBy: "price", sortOrder: "asc" },
  { label: "Rent: high to low", sortBy: "price", sortOrder: "desc" },
  { label: "Available soonest", sortBy: "availability", sortOrder: "asc" },
];

// Server component: reads the URL, fetches matching listings and renders the results
export default async function PropertyResults({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = pickSearchParams(await searchParams, ALLOWED_KEYS);
  const page = toPositiveInt(params.page, 1);

  const { items, meta } = await searchProperties({
    ...params,
    sortBy: params.sortBy ?? "newest",
    sortOrder: params.sortOrder === "asc" ? "asc" : "desc",
    page,
    limit: toPageSize(params.limit, PAGE_SIZE),
  } as PublicPropertyQueryParams);

  const hasFilters = Object.keys(params).some(
    (key) => !["sortBy", "sortOrder", "page", "limit"].includes(key),
  );

  return (
    <div className="space-y-6">
      <ResultsHeader
        meta={meta}
        noun={["listing", "listings"]}
        sortOptions={SORT_OPTIONS}
      />

      {items.length > 0 ? (
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((property, index) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} priority={index < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          icon={SearchX}
          title={
            hasFilters ? "No listings match these filters" : "No listings yet"
          }
          description={
            hasFilters
              ? "Try a wider rent range, another area or fewer amenities."
              : "New homes are published here as soon as owners list them."
          }
          action={
            hasFilters ? (
              <Link
                href="/properties"
                className={buttonVariants({ variant: "outline" })}
              >
                Clear all filters
              </Link>
            ) : (
              <Link href="/register" className={buttonVariants()}>
                List your property
              </Link>
            )
          }
        />
      )}

      <PaginationBar
        meta={meta}
        pathname="/properties"
        params={params}
        summary={`${meta.total} ${meta.total === 1 ? "property" : "properties"} found`}
      />
    </div>
  );
}
