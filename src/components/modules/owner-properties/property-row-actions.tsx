"use client";

import {
  Archive,
  DoorOpen,
  ExternalLink,
  EyeOff,
  ImagePlus,
  MoreHorizontal,
  PencilLine,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ManagedProperty } from "@/types";
import RemovePropertyDialog from "./remove-property-dialog";
import { usePropertyActions } from "./use-property-actions";

// Row menu: only the actions the listing's current status allows
export default function PropertyRowActions({
  property,
}: {
  property: ManagedProperty;
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const actions = usePropertyActions(property);
  const manage = `/owner/properties/${property.id}`;

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
            <DropdownMenuItem render={<Link href={manage} />}>
              <PencilLine />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`${manage}?tab=photos`} />}>
              <ImagePlus />
              Photos
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`${manage}?tab=rooms`} />}>
              <DoorOpen />
              Rooms
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

          {(actions.canPublish || actions.canHide) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {actions.canPublish && (
                  <DropdownMenuItem
                    disabled={Boolean(actions.blocker)}
                    onClick={actions.publish}
                  >
                    <Send />
                    {actions.blocker
                      ? `Publish (${actions.blocker.toLowerCase()})`
                      : "Publish"}
                  </DropdownMenuItem>
                )}
                {actions.canHide && (
                  <DropdownMenuItem onClick={actions.hide}>
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
            onClick={() => setConfirmRemove(true)}
          >
            <Archive />
            Remove listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RemovePropertyDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title={property.title}
        pending={actions.archiving}
        onConfirm={() => actions.archive(() => setConfirmRemove(false))}
      />
    </>
  );
}
