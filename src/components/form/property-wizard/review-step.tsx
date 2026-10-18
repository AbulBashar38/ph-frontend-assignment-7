"use client";

import { Check, Circle, PencilLine, Rocket, Save, X } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { uploadPropertyImages, uploadRoomImages } from "@/api";
import { AMENITY_ICONS, amenityLabel } from "@/components/shared/amenity-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateProperty,
  useCreateRoom,
  useObjectUrls,
  useUpdatePropertyStatus,
  useUploadWithProgress,
} from "@/hooks";
import { cn } from "@/lib/utils";
import { usePropertyWizardStore } from "@/store/property-wizard.store";
import { formatCurrency, formatEnum, getErrorMessage } from "@/utils";
import { toPropertyPayload, toRoomPayload } from "@/validation";
import { BackButton } from "./wizard-nav";

type TaskKey = "create" | "photos" | "rooms" | "publish";
type TaskState = "waiting" | "running" | "done" | "failed";

function Summary({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-heading font-semibold">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onEdit}
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          <PencilLine />
          Edit
        </Button>
      </div>
      <div className="text-sm">{children}</div>
    </section>
  );
}

const TASK_ICONS: Record<TaskState, ReactNode> = {
  waiting: <Circle className="size-4 text-muted-foreground" />,
  running: <Spinner className="size-4 text-primary" />,
  done: <Check className="size-4 text-primary" />,
  failed: <X className="size-4 text-destructive" />,
};

// Last step: check everything, then create the listing, upload photos, add rooms and (optionally) publish
export default function ReviewStep({
  onFinished,
}: {
  onFinished: (propertyId: string) => void;
}) {
  const store = usePropertyWizardStore();
  const { details, location, amenities, photos, rooms, publishNow } = store;
  const createProperty = useCreateProperty();
  const createRoom = useCreateRoom();
  const updateStatus = useUpdatePropertyStatus();
  const upload = useUploadWithProgress(uploadPropertyImages);
  const roomUpload = useUploadWithProgress(uploadRoomImages);
  // Whose photos are uploading right now (the property's or a room's)
  const [uploadingFor, setUploadingFor] = useState("photos");
  const [tasks, setTasks] = useState<Partial<Record<TaskKey, TaskState>>>({});
  const [roomsDone, setRoomsDone] = useState(0);
  const submitting = Object.values(tasks).includes("running");

  const canPublish = photos.length > 0 && rooms.length > 0;
  const willPublish = publishNow && canPublish;

  const cover = useMemo(() => photos.slice(0, 1), [photos]);
  const [coverUrl] = useObjectUrls(cover);

  // Leaving mid-way would strand a half-created listing
  useEffect(() => {
    if (!submitting) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [submitting]);

  const taskList: { key: TaskKey; label: string }[] = [
    { key: "create", label: "Create the listing" },
    ...(photos.length
      ? [
          {
            key: "photos" as const,
            label: `Upload ${photos.length} photo${photos.length === 1 ? "" : "s"}`,
          },
        ]
      : []),
    ...(rooms.length
      ? [
          {
            key: "rooms" as const,
            label: `Add rooms (${roomsDone}/${rooms.length})`,
          },
        ]
      : []),
    ...(willPublish ? [{ key: "publish" as const, label: "Publish" }] : []),
  ];

  const submit = async () => {
    const mark = (key: TaskKey, state: TaskState) =>
      setTasks((current) => ({ ...current, [key]: state }));
    let propertyId: string | null = null;
    let current: TaskKey = "create";

    try {
      setTasks({});
      setRoomsDone(0);
      mark("create", "running");
      const created = await createProperty.mutateAsync(
        toPropertyPayload(details, location, amenities),
      );
      propertyId = created.data.id;
      mark("create", "done");

      if (photos.length) {
        current = "photos";
        mark("photos", "running");
        setUploadingFor("photos");
        await upload.start(propertyId, photos);
        mark("photos", "done");
      }

      if (rooms.length) {
        current = "rooms";
        mark("rooms", "running");
        for (const room of rooms) {
          const created = await createRoom.mutateAsync({
            propertyId,
            payload: toRoomPayload(room),
          });
          const files = store.roomPhotos[room.id] ?? [];
          if (files.length) {
            setUploadingFor(`photos of ${room.name}`);
            await roomUpload.start(created.data.id, files);
          }
          setRoomsDone((count) => count + 1);
        }
        mark("rooms", "done");
      }

      if (willPublish) {
        current = "publish";
        mark("publish", "running");
        await updateStatus.mutateAsync({ id: propertyId, status: "PUBLISHED" });
        mark("publish", "done");
      }

      toast.success(
        willPublish
          ? "Your listing is live"
          : "Listing saved as a draft. Publish it when you're ready",
      );
      onFinished(propertyId);
    } catch (error) {
      mark(current, "failed");
      toast.error(getErrorMessage(error));
      // The listing exists, so finish the rest on its page instead of creating it twice
      if (propertyId) {
        toast.info("The listing was saved. Finish the remaining steps here.");
        onFinished(propertyId);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
        <Summary title="Details" onEdit={() => store.goTo(0)}>
          <p className="font-semibold">{details.title}</p>
          <p className="mt-1 text-muted-foreground">
            {details.propertyType && formatEnum(details.propertyType)}
          </p>
          <p className="mt-2 line-clamp-3 whitespace-pre-line text-muted-foreground">
            {details.description}
          </p>
        </Summary>
        <div className="relative hidden aspect-4/3 overflow-hidden rounded-2xl border bg-muted lg:block">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt="Cover photo"
              fill
              unoptimized
              sizes="256px"
              className="object-cover"
            />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
              No cover photo
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Summary title="Location" onEdit={() => store.goTo(1)}>
          <p>{location.address}</p>
          <p className="text-muted-foreground">
            {location.area}, {location.city}
          </p>
        </Summary>
        <Summary title="Photos" onEdit={() => store.goTo(3)}>
          {photos.length ? (
            <p>
              {photos.length} photo{photos.length === 1 ? "" : "s"} ready to
              upload
            </p>
          ) : (
            <p className="text-muted-foreground">No photos yet</p>
          )}
        </Summary>
      </div>

      <Summary title="Amenities" onEdit={() => store.goTo(2)}>
        {amenities.length ? (
          <ul className="flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const Icon = AMENITY_ICONS[amenity];
              return (
                <li key={amenity}>
                  <Badge variant="muted">
                    <Icon />
                    {amenityLabel(amenity)}
                  </Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground">None selected</p>
        )}
      </Summary>

      <Summary title="Rooms" onEdit={() => store.goTo(4)}>
        {rooms.length ? (
          <ul className="divide-y">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 truncate">
                  {room.name}
                  <span className="text-muted-foreground">
                    {" "}
                    · {room.roomType && formatEnum(room.roomType)} · fits{" "}
                    {room.maxOccupants} ·{" "}
                    {store.roomPhotos[room.id]?.length ?? 0} photo
                    {store.roomPhotos[room.id]?.length === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatCurrency(room.monthlyRent)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No rooms yet</p>
        )}
      </Summary>

      <Field
        orientation="horizontal"
        className="rounded-2xl border bg-accent/40 p-4"
        data-disabled={!canPublish}
      >
        <Checkbox
          id="publish-now"
          checked={willPublish}
          disabled={!canPublish || submitting}
          onCheckedChange={(checked) => store.setPublishNow(checked)}
        />
        <div className="space-y-1">
          <FieldLabel htmlFor="publish-now">Publish right away</FieldLabel>
          <FieldDescription>
            {canPublish
              ? "Tenants can find it in search as soon as it's created. Untick to keep it as a draft."
              : "Add at least one photo and one room to publish. You can still save it as a draft."}
          </FieldDescription>
        </div>
      </Field>

      {Object.keys(tasks).length > 0 && (
        <div className="space-y-3 rounded-2xl border p-4" aria-live="polite">
          <ul className="space-y-2 text-sm">
            {taskList.map((task) => {
              const state = tasks[task.key] ?? "waiting";
              return (
                <li
                  key={task.key}
                  className={cn(
                    "flex items-center gap-2",
                    state === "waiting" && "text-muted-foreground",
                    state === "failed" && "text-destructive",
                  )}
                >
                  {TASK_ICONS[state]}
                  {task.label}
                </li>
              );
            })}
          </ul>
          {(upload.progress ?? roomUpload.progress) !== null && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Uploading {uploadingFor}…</span>
                <span className="tabular-nums text-muted-foreground">
                  {upload.progress ?? roomUpload.progress}%
                </span>
              </div>
              <Progress
                value={upload.progress ?? roomUpload.progress}
                aria-label="Upload progress"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>{!submitting && <BackButton onClick={() => store.goTo(4)} />}</div>
        <Button
          type="button"
          size="lg"
          disabled={submitting}
          onClick={submit}
          className="sm:min-w-52"
        >
          {submitting ? (
            <>
              <Spinner /> Creating listing
            </>
          ) : willPublish ? (
            <>
              <Rocket /> Create and publish
            </>
          ) : (
            <>
              <Save /> Save as draft
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
