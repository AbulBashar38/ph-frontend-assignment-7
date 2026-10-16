"use client";

import { Check, Heart, ImageOff, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AMENITY_ICONS, amenityLabel } from "@/components/shared/amenity-list";
import EmptyState from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted, useShortlistProperties } from "@/hooks";
import { SHORTLIST_LIMIT, useShortlistStore } from "@/store/shortlist.store";
import type { Amenity, Property } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";

export function ShortlistSkeleton() {
  return <Skeleton className="h-[28rem] w-full rounded-2xl" />;
}

function RowHeader({ children }: { children: ReactNode }) {
  return (
    <th
      scope="row"
      className="sticky left-0 z-10 w-40 bg-card px-4 py-3 text-left text-sm font-medium text-muted-foreground"
    >
      {children}
    </th>
  );
}

// Saved properties side by side, always with live data (the browser only keeps their ids)
export default function ShortlistCompare() {
  const mounted = useMounted();
  const ids = useShortlistStore((state) => state.ids);
  const remove = useShortlistStore((state) => state.remove);
  const clear = useShortlistStore((state) => state.clear);
  const queries = useShortlistProperties(mounted ? ids : []);

  if (!mounted || queries.some((query) => query.isPending)) {
    return <ShortlistSkeleton />;
  }

  if (ids.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your shortlist is empty"
        description={`Tap the heart on any property to save it here, then compare up to ${SHORTLIST_LIMIT} side by side.`}
        action={
          <Link href="/properties" className={buttonVariants()}>
            Browse properties
          </Link>
        }
      />
    );
  }

  const columns = ids.map((id, index) => ({ id, query: queries[index] }));
  const live = columns
    .map(({ query }) => query.data)
    .filter((property): property is Property => Boolean(property));
  const amenities = [
    ...new Set(live.flatMap((property) => property.amenities)),
  ] as Amenity[];

  const cell = (render: (property: Property) => ReactNode) =>
    columns.map(({ id, query }) => (
      <td key={id} className="px-4 py-3 align-top text-sm">
        {query.data ? (
          render(query.data)
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
    ));

  const rows: [string, (property: Property) => ReactNode][] = [
    ["Type", (property) => formatEnum(property.propertyType)],
    ["Area", (property) => `${property.area}, ${property.city}`],
    [
      "Rent from",
      (property) =>
        property.minAvailableRent !== null ? (
          <span className="font-semibold text-primary tabular-nums">
            {formatCurrency(property.minAvailableRent)}/month
          </span>
        ) : (
          "No free room"
        ),
    ],
    [
      "Free rooms",
      (property) =>
        `${property.availableRoomCount} of ${property.rooms.length}`,
    ],
    [
      "Available from",
      (property) =>
        property.earliestAvailableFrom
          ? formatDate(property.earliestAvailableFrom)
          : "—",
    ],
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {ids.length} of {SHORTLIST_LIMIT} saved · kept in this browser
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Trash2 />
          Clear all
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[40rem] table-fixed border-collapse">
          <caption className="sr-only">Saved properties compared</caption>
          <thead>
            <tr className="border-b">
              <td className="sticky left-0 z-10 w-40 bg-card" />
              {columns.map(({ id, query }) => {
                const property = query.data;
                return (
                  <th
                    key={id}
                    scope="col"
                    className="px-4 py-4 text-left align-top font-normal"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                        {property?.images[0] ? (
                          <Image
                            src={property.images[0].url}
                            alt=""
                            fill
                            sizes="224px"
                            className="object-cover"
                          />
                        ) : (
                          <ImageOff className="absolute inset-0 m-auto size-6 text-muted-foreground" />
                        )}
                      </div>
                      {property ? (
                        <Link
                          href={`/properties/${property.id}`}
                          className="line-clamp-2 font-heading font-semibold hover:text-primary hover:underline"
                        >
                          {property.title}
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {query.isError
                            ? "Couldn't load this listing"
                            : "No longer listed"}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => remove(id)}
                        aria-label={`Remove ${property?.title ?? "this listing"} from your shortlist`}
                      >
                        <Trash2 />
                        Remove
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(([label, render]) => (
              <tr key={label}>
                <RowHeader>{label}</RowHeader>
                {cell(render)}
              </tr>
            ))}
            {amenities.map((amenity) => {
              const Icon = AMENITY_ICONS[amenity];
              return (
                <tr key={amenity}>
                  <RowHeader>
                    <span className="flex items-center gap-2">
                      <Icon className="size-4 text-primary" />
                      {amenityLabel(amenity)}
                    </span>
                  </RowHeader>
                  {cell((property) =>
                    property.amenities.includes(amenity) ? (
                      <Check className="size-4 text-primary" aria-label="Yes" />
                    ) : (
                      <Minus
                        className="size-4 text-muted-foreground"
                        aria-label="No"
                      />
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
