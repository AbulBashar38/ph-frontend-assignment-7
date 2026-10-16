"use client";

import { CircleStop, DoorOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import StatusNoteDialog from "@/components/shared/status-note-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateRentalStatus } from "@/hooks";
import type { Rental, RentalStatusPayload } from "@/types";
import { getErrorMessage } from "@/utils";

// ACTIVE → COMPLETED (moved out); PENDING | ACTIVE → TERMINATED (ended early, with a reason). Either side may end it.
export default function RentalActions({ rental }: { rental: Rental }) {
  const mutation = useUpdateRentalStatus();
  const [dialog, setDialog] = useState<"complete" | "terminate" | null>(null);

  const send = (payload: RentalStatusPayload, message: string) =>
    mutation.mutate(
      { id: rental.id, payload },
      {
        onSuccess: () => {
          toast.success(message);
          setDialog(null);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  if (rental.status !== "PENDING" && rental.status !== "ACTIVE") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {rental.status === "ACTIVE" && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => setDialog("complete")}
          >
            <DoorOpen />
            Moved out
          </Button>
        )}
        <Button
          size="xs"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setDialog("terminate")}
        >
          <CircleStop />
          End early
        </Button>
      </div>

      <ConfirmDialog
        open={dialog === "complete"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Mark this rental as finished?"
        description={`Use this when the tenant has moved out of ${rental.room.name}. The room becomes available again and no more rent is billed.`}
        confirmLabel="Finish rental"
        pending={mutation.isPending}
        onConfirm={() =>
          send(
            { status: "COMPLETED" },
            "Rental finished. The room is free again",
          )
        }
      />
      <StatusNoteDialog
        open={dialog === "terminate"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="End this rental early?"
        description="The room is freed and unpaid bills are cancelled. The other side is told why."
        noteRequired
        noteLabel="Reason"
        notePlaceholder="e.g. The tenant is relocating for work"
        submitLabel="End rental"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          send({ status: "TERMINATED", reason: note.trim() }, "Rental ended")
        }
      />
    </>
  );
}
