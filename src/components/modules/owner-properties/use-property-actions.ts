"use client";

import { toast } from "sonner";
import { useArchiveProperty, useUpdatePropertyStatus } from "@/hooks";
import type { ManagedProperty, ManualPropertyStatus } from "@/types";
import { getErrorMessage } from "@/utils";

// What's still missing before a listing can go live (the backend needs a photo and a room)
export function publishBlocker(property: ManagedProperty) {
  if (property.images.length === 0) return "Add a photo first";
  if (property.rooms.length === 0) return "Add a room first";
  return null;
}

// Publish / hide / remove for one listing, with the toasts; shared by the table menu and the property page
export function usePropertyActions(property: ManagedProperty) {
  const statusMutation = useUpdatePropertyStatus();
  const archiveMutation = useArchiveProperty();

  // Suspended listings wait for an admin; archived ones are gone
  const canPublish =
    property.status === "DRAFT" || property.status === "INACTIVE";
  const canHide = property.status === "PUBLISHED";

  const changeStatus = (status: ManualPropertyStatus) =>
    statusMutation.mutate(
      { id: property.id, status },
      {
        onSuccess: () =>
          toast.success(
            status === "PUBLISHED"
              ? `"${property.title}" is now live`
              : `"${property.title}" is hidden from search`,
          ),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  const archive = (onDone?: () => void) =>
    archiveMutation.mutate(property.id, {
      onSuccess: () => {
        toast.success(`"${property.title}" was removed`);
        onDone?.();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  return {
    canPublish,
    canHide,
    blocker: canPublish ? publishBlocker(property) : null,
    publish: () => changeStatus("PUBLISHED"),
    hide: () => changeStatus("INACTIVE"),
    statusPending: statusMutation.isPending,
    archive,
    archiving: archiveMutation.isPending,
  };
}
