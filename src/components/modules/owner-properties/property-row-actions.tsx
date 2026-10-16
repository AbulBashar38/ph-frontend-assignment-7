"use client";

import {
  Archive,
  DoorOpen,
  ExternalLink,
  EyeOff,
  MoreHorizontal,
  PencilLine,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveProperty, useUpdatePropertyStatus } from "@/hooks";
import type { ManagedProperty, ManualPropertyStatus } from "@/types";
import { getErrorMessage } from "@/utils";

// What's still missing before a listing can go live (the backend needs a photo and a room)
export function publishBlocker(property: ManagedProperty) {
  if (property.images.length === 0) return "Add a photo first";
  if (property.rooms.length === 0) return "Add a room first";
  return null;
}

// Row menu: only the actions the listing's current status allows
export default function PropertyRowActions({
  property,
}: {
  property: ManagedProperty;
}) {
  const [confirmArchive, setConfirmArchive] = useState(false);
  const statusMutation = useUpdatePropertyStatus();
  const archiveMutation = useArchiveProperty();

  const canPublish =
    property.status === "DRAFT" || property.status === "INACTIVE";
  const blocker = canPublish ? publishBlocker(property) : null;

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Actions for ${property.title}`}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link href={`/owner/properties/${property.id}`} />}
            >
              <PencilLine />
              Edit details & photos
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={`/owner/properties/${property.id}#rooms`} />}
            >
              <DoorOpen />
              Manage rooms
            </DropdownMenuItem>
            {property.status === "PUBLISHED" && (
              <DropdownMenuItem
                render={<Link href={`/properties/${property.id}`} />}
              >
                <ExternalLink />
                View public page
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          {(canPublish || property.status === "PUBLISHED") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {canPublish && (
                  <DropdownMenuItem
                    disabled={Boolean(blocker)}
                    onClick={() => changeStatus("PUBLISHED")}
                  >
                    <Send />
                    {blocker ? `Publish (${blocker.toLowerCase()})` : "Publish"}
                  </DropdownMenuItem>
                )}
                {property.status === "PUBLISHED" && (
                  <DropdownMenuItem onClick={() => changeStatus("INACTIVE")}>
                    <EyeOff />
                    Hide from search
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmArchive(true)}
          >
            <Archive />
            Remove listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        title={`Remove "${property.title}"?`}
        description="The listing and its rooms leave search, and open viewing requests and applications are cancelled. Listings with reserved or occupied rooms can't be removed."
        confirmLabel="Remove listing"
        destructive
        pending={archiveMutation.isPending}
        onConfirm={() =>
          archiveMutation.mutate(property.id, {
            onSuccess: () => {
              toast.success(`"${property.title}" was removed`);
              setConfirmArchive(false);
            },
            onError: (error) => toast.error(getErrorMessage(error)),
          })
        }
      />
    </>
  );
}
