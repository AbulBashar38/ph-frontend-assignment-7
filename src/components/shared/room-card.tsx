import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";

export default function RoomCard({
  room,
  priority = false,
}: {
  room: Room;
  priority?: boolean;
}) {
  // Rooms without their own photos show the building's
  const image = room.images[0]?.url ?? room.property.images[0]?.url;

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={`${room.name} in ${room.property.title}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent to-secondary">
            <BedDouble className="size-10 text-primary/40" />
          </div>
        )}
        <Badge variant="glass" className="absolute top-3 left-3">
          {formatEnum(room.roomType)} room
        </Badge>
        <Badge
          variant="highlight"
          className="absolute bottom-3 left-3 font-bold"
        >
          {formatCurrency(room.monthlyRent)}
          <span className="font-medium opacity-80">/mo</span>
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-snug font-semibold">
              {room.name}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              in {room.property.title}
            </p>
          </div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">
            {room.property.area}, {room.property.city}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
          <StatusBadge status={room.status} />
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            Up to {room.maxOccupants}
          </span>
          {room.availableFrom && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              From {formatDate(room.availableFrom, "dd MMM")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
