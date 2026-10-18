"use client";

import {
  DoorOpen,
  ImageIcon,
  PencilLine,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type RoomDraft,
  usePropertyWizardStore,
} from "@/store/property-wizard.store";
import { formatCurrency, formatDate, formatEnum } from "@/utils";
import { EMPTY_ROOM } from "@/validation";
import RoomForm from "../room-form";
import { StepNav } from "./wizard-nav";

export default function RoomsStep() {
  const rooms = usePropertyWizardStore((state) => state.rooms);
  const roomPhotos = usePropertyWizardStore((state) => state.roomPhotos);
  const addRoom = usePropertyWizardStore((state) => state.addRoom);
  const updateRoom = usePropertyWizardStore((state) => state.updateRoom);
  const removeRoom = usePropertyWizardStore((state) => state.removeRoom);
  const goTo = usePropertyWizardStore((state) => state.goTo);
  const step = usePropertyWizardStore((state) => state.step);
  // null: closed, "new": adding, a draft: editing it
  const [editing, setEditing] = useState<RoomDraft | "new" | null>(null);

  const addButton = (
    <Button type="button" variant="outline" onClick={() => setEditing("new")}>
      <Plus />
      Add a room
    </Button>
  );

  return (
    <div className="space-y-6">
      {rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No rooms yet"
          description="Each room has its own rent and capacity, and tenants apply for a room. You need at least one to publish."
          action={addButton}
        />
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="flex items-start justify-between gap-3 rounded-2xl border bg-card p-4"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-semibold">{room.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {room.roomType && formatEnum(room.roomType)} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" /> {room.maxOccupants}
                    </span>
                    {room.availableFrom &&
                      ` · from ${formatDate(room.availableFrom)}`}
                  </p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ImageIcon className="size-3.5" />
                    {roomPhotos[room.id]?.length
                      ? `${roomPhotos[room.id].length} photo${roomPhotos[room.id].length === 1 ? "" : "s"}`
                      : "No photos"}
                  </p>
                  <p className="font-heading text-lg font-semibold text-primary">
                    {formatCurrency(room.monthlyRent)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Edit ${room.name}`}
                    onClick={() => setEditing(room)}
                  >
                    <PencilLine />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${room.name}`}
                    onClick={() => removeRoom(room.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {addButton}
        </>
      )}

      <StepNav
        onBack={() => goTo(step - 1)}
        onNext={() => goTo(step + 1)}
        nextLabel={rooms.length ? "Review" : "Skip for now"}
      />

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="p-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editing === "new" ? "Add a room" : "Edit room"}
            </DialogTitle>
            <DialogDescription>
              Rent is per month for the whole room.
            </DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <RoomForm
              defaultValues={editing === "new" ? EMPTY_ROOM : editing}
              submitLabel={editing === "new" ? "Add room" : "Save room"}
              withPhotos
              initialPhotos={
                editing === "new" ? [] : (roomPhotos[editing.id] ?? [])
              }
              secondary={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
              }
              onSubmit={(values, photos) => {
                if (editing === "new") addRoom(values, photos);
                else updateRoom(editing.id, values, photos);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
