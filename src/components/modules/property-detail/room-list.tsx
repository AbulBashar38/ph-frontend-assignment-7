import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  DoorOpen,
  Users,
} from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import type { RoomSummary } from "@/types";
import { formatCurrency, formatDate, formatEnum } from "@/utils";

// Rooms inside a property, available ones first
export default function RoomList({ rooms }: { rooms: RoomSummary[] }) {
  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={DoorOpen}
        title="No rooms listed yet"
        description="The owner hasn't added rooms to this property."
      />
    );
  }

  const sorted = [...rooms].sort(
    (a, b) =>
      Number(b.status === "AVAILABLE") - Number(a.status === "AVAILABLE") ||
      a.monthlyRent - b.monthlyRent,
  );

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sorted.map((room) => (
        <li key={room.id}>
          <Link
            href={`/rooms/${room.id}`}
            className="group flex h-full flex-col gap-3 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  {room.name}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatEnum(room.roomType)} room
                </p>
              </div>
              <StatusBadge status={room.status} />
            </div>

            <p className="font-heading text-xl font-bold">
              {formatCurrency(room.monthlyRent)}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}
                /month
              </span>
            </p>

            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                Up to {room.maxOccupants}{" "}
                {room.maxOccupants === 1 ? "person" : "people"}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="size-3.5" />
                {room.currentOccupants} living here
              </span>
              {room.availableFrom && room.status === "AVAILABLE" && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  From {formatDate(room.availableFrom, "dd MMM")}
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
