"use client";

import {
  CalendarDays,
  ImageOff,
  ImagePlus,
  PencilLine,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { useUpdateRoomStatus } from "@/hooks";
import type { ManagedRoom, ManualRoomStatus } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatEnum,
  getErrorMessage,
} from "@/utils";

const MANUAL_STATUSES: ManualRoomStatus[] = [
  "AVAILABLE",
  "UNAVAILABLE",
  "MAINTENANCE",
];

// RESERVED / OCCUPIED follow the rental, so the owner can't change or remove those rooms
const isRented = (room: ManagedRoom) =>
  room.status === "RESERVED" || room.status === "OCCUPIED";

export default function RoomCard({
  room,
  removeBlocker,
  onEdit,
  onPhotos,
  onRemove,
}: {
  room: ManagedRoom;
  // Why this room can't be removed right now, if anything
  removeBlocker: string | null;
  onEdit: () => void;
  onPhotos: () => void;
  onRemove: () => void;
}) {
  const statusMutation = useUpdateRoomStatus();
  const rented = isRented(room);
  const blocker = rented
    ? `This room is ${room.status.toLowerCase()} by a tenant`
    : removeBlocker;

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border bg-card sm:flex-row">
      <button
        type="button"
        onClick={onPhotos}
        aria-label={`Photos of ${room.name}`}
        className="group relative aspect-video shrink-0 bg-muted sm:aspect-auto sm:w-44"
      >
        {room.images[0] ? (
          <Image
            src={room.images[0].url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover"
          />
        ) : (
          <ImageOff className="absolute inset-0 m-auto size-6 text-muted-foreground" />
        )}
        <span className="absolute right-2 bottom-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium shadow-xs">
          {room.images.length} photo{room.images.length === 1 ? "" : "s"}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold">{room.name}</h3>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{formatEnum(room.roomType)}</span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" />
                {room.currentOccupants}/{room.maxOccupants}
              </span>
              {room.availableFrom && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  from {formatDate(room.availableFrom)}
                </span>
              )}
            </p>
          </div>
          <p className="font-heading text-xl font-semibold text-primary">
            {formatCurrency(room.monthlyRent)}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          {rented ? (
            <StatusBadge status={room.status} size="default" />
          ) : (
            <NativeSelect
              aria-label={`Status of ${room.name}`}
              value={room.status}
              disabled={statusMutation.isPending}
              onChange={(event) => {
                const status = event.target.value as ManualRoomStatus;
                statusMutation.mutate(
                  { id: room.id, status },
                  {
                    onSuccess: () =>
                      toast.success(
                        `${room.name} is now ${formatEnum(status).toLowerCase()}`,
                      ),
                    onError: (error) => toast.error(getErrorMessage(error)),
                  },
                );
              }}
              className="w-44"
            >
              {MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatEnum(status)}
                </option>
              ))}
            </NativeSelect>
          )}

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <PencilLine />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Photos of ${room.name}`}
              onClick={onPhotos}
            >
              <ImagePlus />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={
                blocker
                  ? `Can't remove ${room.name}: ${blocker}`
                  : `Remove ${room.name}`
              }
              title={blocker ?? undefined}
              disabled={Boolean(blocker)}
              onClick={onRemove}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
