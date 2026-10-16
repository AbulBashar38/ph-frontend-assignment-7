"use client";

import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import StatusNoteDialog from "@/components/shared/status-note-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUpdatePropertyStatus } from "@/hooks";
import type { ManagedProperty } from "@/types";
import { getErrorMessage } from "@/utils";

// Suspend a listing (hidden from search, the owner sees the reason) or lift a suspension
export default function ModerationActions({
  property,
}: {
  property: ManagedProperty;
}) {
  const mutation = useUpdatePropertyStatus();
  const [dialog, setDialog] = useState<"suspend" | "restore" | null>(null);
  const suspended = property.status === "SUSPENDED";

  const onDone = (message: string) => ({
    onSuccess: () => {
      toast.success(message);
      setDialog(null);
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="flex justify-end gap-2">
      {property.status === "PUBLISHED" && (
        <Link
          href={`/properties/${property.id}`}
          aria-label={`Open the public page of ${property.title}`}
          className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
        >
          <ExternalLink />
        </Link>
      )}
      {suspended ? (
        <Button
          size="xs"
          variant="outline"
          onClick={() => setDialog("restore")}
        >
          <ShieldCheck />
          Restore
        </Button>
      ) : (
        <Button
          size="xs"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setDialog("suspend")}
        >
          <ShieldAlert />
          Suspend
        </Button>
      )}

      <StatusNoteDialog
        open={dialog === "suspend"}
        onOpenChange={(open) => !open && setDialog(null)}
        title={`Suspend "${property.title}"?`}
        description="It's hidden from search and the owner can't publish it until you restore it. They see your reason."
        noteMinLength={5}
        noteLabel="Reason"
        notePlaceholder="e.g. Photos don't match the address"
        submitLabel="Suspend listing"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          mutation.mutate(
            { id: property.id, status: "SUSPENDED", reason: note.trim() },
            onDone("Listing suspended. The owner has been notified"),
          )
        }
      />
      <ConfirmDialog
        open={dialog === "restore"}
        onOpenChange={(open) => !open && setDialog(null)}
        title={`Restore "${property.title}"?`}
        description="The suspension is lifted and the listing goes back to hidden. The owner can publish it again."
        confirmLabel="Restore"
        pending={mutation.isPending}
        onConfirm={() =>
          mutation.mutate(
            { id: property.id, status: "INACTIVE" },
            onDone("Suspension lifted"),
          )
        }
      />
    </div>
  );
}
