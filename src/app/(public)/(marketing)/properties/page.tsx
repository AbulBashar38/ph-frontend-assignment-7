import type { Metadata } from "next";
import { Suspense } from "react";
import ListingFilters from "@/components/modules/listings/listing-filters";
import ListingGridSkeleton from "@/components/modules/listings/listing-grid-skeleton";
import PendingResults from "@/components/modules/listings/pending-results";
import PropertyResults from "@/components/modules/listings/property-results";
import PageHeader from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Properties for rent",
  description:
    "Browse flats, houses, sublets, hostels and studios for rent in Bangladesh. Filter by area, rent, room type and amenities, with real move-in dates.",
  openGraph: {
    title: "Properties for rent | BariBasa",
    description:
      "Search rental homes by area, rent, room type and amenities, with real rent and move-in dates.",
    url: "/properties",
  },
};

export default function PropertiesPage({
  searchParams,
}: PageProps<"/properties">) {
  return (
    <>
      <PageHeader
        eyebrow="Find a home"
        title="Properties for rent"
        description="Every listing shows its real starting rent, how many rooms are free and when you can move in."
        breadcrumbs={[{ label: "Properties" }]}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <Suspense fallback={<Skeleton className="h-12 w-full lg:h-[36rem]" />}>
          <ListingFilters kind="properties" />
        </Suspense>

        <Suspense fallback={<ListingGridSkeleton />}>
          <PendingResults>
            <PropertyResults searchParams={searchParams} />
          </PendingResults>
        </Suspense>
      </div>
    </>
  );
}
