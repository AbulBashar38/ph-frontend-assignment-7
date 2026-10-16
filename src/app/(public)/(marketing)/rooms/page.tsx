import type { Metadata } from "next";
import { Suspense } from "react";
import ListingFilters from "@/components/modules/listings/listing-filters";
import ListingGridSkeleton from "@/components/modules/listings/listing-grid-skeleton";
import PendingResults from "@/components/modules/listings/pending-results";
import RoomResults from "@/components/modules/listings/room-results";
import PageHeader from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Rooms for rent",
  description:
    "Find single, shared, master and studio rooms for rent in Bangladesh. Filter by rent, area, number of people and amenities, and apply online.",
  openGraph: {
    title: "Rooms for rent | BariBasa",
    description:
      "Single, shared, master and studio rooms with real rent and move-in dates. Request a viewing or apply online.",
    url: "/rooms",
  },
};

export default function RoomsPage({ searchParams }: PageProps<"/rooms">) {
  return (
    <>
      <PageHeader
        eyebrow="Rooms & shares"
        title="Rooms for rent"
        description="Rent a single room, a shared room or a whole studio. Each room has its own rent and capacity."
        breadcrumbs={[{ label: "Rooms" }]}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <Suspense fallback={<Skeleton className="h-12 w-full lg:h-[36rem]" />}>
          <ListingFilters kind="rooms" />
        </Suspense>

        <Suspense fallback={<ListingGridSkeleton />}>
          <PendingResults>
            <RoomResults searchParams={searchParams} />
          </PendingResults>
        </Suspense>
      </div>
    </>
  );
}
