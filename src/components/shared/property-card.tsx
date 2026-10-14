import { ArrowUpRight, BedDouble, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const image = property.images?.[0]?.url;
  const rooms = property.availableRoomCount;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent to-secondary">
            <BedDouble className="size-10 text-primary/40" />
          </div>
        )}

        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {formatEnum(property.propertyType)}
        </span>

        {property.minAvailableRent != null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-highlight px-3 py-1 text-sm font-bold text-highlight-foreground shadow-sm">
            {formatCurrency(property.minAvailableRent)}
            <span className="font-medium opacity-80"> /mo</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg leading-snug font-semibold line-clamp-2">
            {property.title}
          </h3>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">
            {property.area}, {property.city}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-3.5" />
            {rooms > 0
              ? `${rooms} room${rooms > 1 ? "s" : ""} available`
              : "Fully occupied"}
          </span>
          {property.earliestAvailableFrom && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              From {formatDate(property.earliestAvailableFrom, "dd MMM")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
