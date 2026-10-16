"use client";

import { DoorOpen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadRoomImages } from "@/api";
import RoomForm from "@/components/form/room-form";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import PhotoManager from "@/components/shared/photo-manager";
import QueryError from "@/components/shared/query-error";
import SectionCard from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArchiveRoom,
  useCreateRoom,
  useDeleteRoomImage,
  useManagedRooms,
  useUpdateRoom,
  useUploadWithProgress,
} from "@/hooks";
import type { ManagedProperty, ManagedRoom } from "@/types";
import { getErrorMessage } from "@/utils";
import { EMPTY_ROOM, type RoomFormValues, toRoomPayload } from "@/validation";
import RoomCard from "./room-card";

// Same limit as the backend's MAX_IMAGES_PER_ROOM
const MAX_ROOM_PHOTOS = 10;

type Panel =
  | { kind: "new" }
  | { kind: "edit"; room: ManagedRoom }
  | { kind: "photos"; roomId: string }
  | { kind: "remove"; room: ManagedRoom };

const toFormValues = (room: ManagedRoom): RoomFormValues => ({
  name: room.name,
  roomType: room.roomType,
  monthlyRent: room.monthlyRent,
  maxOccupants: room.maxOccupants,
  description: room.description ?? "",
  availableFrom: room.availableFrom ? room.availableFrom.slice(0, 10) : "",
  amenities: room.amenities,
});

export default function RoomsTab({ property }: { property: ManagedProperty }) {
  const rooms = useManagedRooms({
    propertyId: property.id,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "asc",
  });
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const archiveRoom = useArchiveRoom();
  const removeImage = useDeleteRoomImage();
  const upload = useUploadWithProgress(uploadRoomImages);
  const [panel, setPanel] = useState<Panel | null>(null);
  const close = () => setPanel(null);

  const list = rooms.data?.data ?? [];
  // The photo dialog reads the room from the live list so new uploads appear in it
  const photoRoom =
    panel?.kind === "photos"
      ? list.find((room) => room.id === panel.roomId)
      : undefined;
  const lastLiveRoom = property.status === "PUBLISHED" && list.length <= 1;

  const onSaved = (message: string) => ({
    onSuccess: () => {
      toast.success(message);
      close();
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  const addButton = (
    <Button size="sm" onClick={() => setPanel({ kind: "new" })}>
      <Plus />
      Add room
    </Button>
  );

  let content: React.ReactNode;
  if (rooms.isPending) {
    content = (
      <div className="space-y-3">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    );
  } else if (rooms.isError) {
    content = (
      <QueryError error={rooms.error} onRetry={() => rooms.refetch()} />
    );
  } else if (list.length === 0) {
    content = (
      <EmptyState
        icon={DoorOpen}
        title="No rooms yet"
        description="Tenants apply for a room, so add at least one before publishing."
        action={addButton}
      />
    );
  } else {
    content = (
      <ul className="space-y-3">
        {list.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            removeBlocker={
              lastLiveRoom
                ? "A published listing needs at least one room"
                : null
            }
            onEdit={() => setPanel({ kind: "edit", room })}
            onPhotos={() => setPanel({ kind: "photos", roomId: room.id })}
            onRemove={() => setPanel({ kind: "remove", room })}
          />
        ))}
      </ul>
    );
  }

  return (
    <SectionCard
      title="Rooms"
      description="Each room has its own rent, capacity and status."
      action={list.length > 0 ? addButton : undefined}
    >
      {content}

      <Dialog
        open={panel?.kind === "new" || panel?.kind === "edit"}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="p-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {panel?.kind === "edit"
                ? `Edit ${panel.room.name}`
                : "Add a room"}
            </DialogTitle>
            <DialogDescription>
              Rent is per month for the whole room.
            </DialogDescription>
          </DialogHeader>
          {panel?.kind === "new" && (
            <RoomForm
              defaultValues={EMPTY_ROOM}
              submitLabel="Add room"
              pending={createRoom.isPending}
              secondary={
                <Button type="button" variant="ghost" onClick={close}>
                  Cancel
                </Button>
              }
              onSubmit={(values) =>
                createRoom.mutate(
                  { propertyId: property.id, payload: toRoomPayload(values) },
                  onSaved(`${values.name.trim()} added`),
                )
              }
            />
          )}
          {panel?.kind === "edit" && (
            <RoomForm
              defaultValues={toFormValues(panel.room)}
              submitLabel="Save room"
              pending={updateRoom.isPending}
              secondary={
                <Button type="button" variant="ghost" onClick={close}>
                  Cancel
                </Button>
              }
              onSubmit={(values) =>
                updateRoom.mutate(
                  { id: panel.room.id, payload: toRoomPayload(values) },
                  onSaved("Room saved"),
                )
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={panel?.kind === "photos"}
        onOpenChange={(open) => !open && !upload.isUploading && close()}
      >
        <DialogContent className="p-6 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Photos of {photoRoom?.name ?? "this room"}
            </DialogTitle>
            <DialogDescription>
              Shown on the room's page. The first one is its cover.
            </DialogDescription>
          </DialogHeader>
          {photoRoom && (
            <PhotoManager
              photos={photoRoom.images}
              maxTotal={MAX_ROOM_PHOTOS}
              removing={removeImage.isPending}
              onRemove={(photo) =>
                removeImage
                  .mutateAsync({ id: photoRoom.id, imageId: photo.id })
                  .then(() => toast.success("Photo removed"))
                  .catch((error) => toast.error(getErrorMessage(error)))
              }
              progress={upload.progress}
              onUpload={(files) => upload.start(photoRoom.id, files)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={panel?.kind === "remove"}
        onOpenChange={(open) => !open && close()}
        title={`Remove ${panel?.kind === "remove" ? panel.room.name : "room"}?`}
        description="It leaves the listing, and open viewing requests and applications for it are cancelled."
        confirmLabel="Remove room"
        destructive
        pending={archiveRoom.isPending}
        onConfirm={() =>
          panel?.kind === "remove" &&
          archiveRoom.mutate(
            panel.room.id,
            onSaved(`${panel.room.name} was removed`),
          )
        }
      />
    </SectionCard>
  );
}
