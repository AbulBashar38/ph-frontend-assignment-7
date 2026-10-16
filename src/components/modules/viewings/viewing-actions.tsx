"use client";

import { CalendarClock, Check, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StatusNoteDialog from "@/components/shared/status-note-dialog";
import { Button } from "@/components/ui/button";
import { useAuth, useUpdateViewingStatus } from "@/hooks";
import type { ViewingListItem, ViewingStatusPayload } from "@/types";
import { formatDateTime, getErrorMessage } from "@/utils";

type Dialog = "reject" | "reschedule" | "cancel";

// Only the moves the backend allows for this status and role (see ViewingStatus in enums.prisma)
export default function ViewingActions({
  viewing,
}: {
  viewing: ViewingListItem;
}) {
  const { isTenant, isOwner, isAdmin } = useAuth();
  const mutation = useUpdateViewingStatus();
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const canReview = isOwner || isAdmin;
  const open = ["PENDING", "APPROVED", "RESCHEDULED"].includes(viewing.status);
  const timeHasPassed =
    new Date(viewing.scheduledAt ?? viewing.preferredAt).getTime() <=
    Date.now();
  const tenant = viewing.tenant.name.split(" ")[0];

  const send = (payload: ViewingStatusPayload, message: string) =>
    mutation.mutate(
      { id: viewing.id, payload },
      {
        onSuccess: () => {
          toast.success(message);
          setDialog(null);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  const buttons = [];
  if (canReview && viewing.status === "PENDING") {
    // A request whose time already passed can only be moved to a new time
    if (!timeHasPassed) {
      buttons.push(
        <Button
          key="approve"
          size="xs"
          disabled={mutation.isPending}
          onClick={() =>
            send(
              { status: "APPROVED" },
              `Viewing approved. ${tenant} has been notified`,
            )
          }
        >
          <Check />
          Approve
        </Button>,
      );
    }
    buttons.push(
      <Button
        key="reschedule"
        size="xs"
        variant="outline"
        onClick={() => setDialog("reschedule")}
      >
        <CalendarClock />
        Reschedule
      </Button>,
      <Button
        key="reject"
        size="xs"
        variant="ghost"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setDialog("reject")}
      >
        <X />
        Decline
      </Button>,
    );
  }
  if (
    canReview &&
    (viewing.status === "APPROVED" || viewing.status === "RESCHEDULED") &&
    timeHasPassed
  ) {
    buttons.push(
      <Button
        key="complete"
        size="xs"
        variant="outline"
        disabled={mutation.isPending}
        onClick={() =>
          send({ status: "COMPLETED" }, "Viewing marked as completed")
        }
      >
        <CheckCheck />
        Mark done
      </Button>,
    );
  }
  if (isTenant && open) {
    buttons.push(
      <Button
        key="cancel"
        size="xs"
        variant="outline"
        onClick={() => setDialog("cancel")}
      >
        <X />
        Cancel
      </Button>,
    );
  }

  return (
    <>
      {buttons.length > 0 ? (
        <div className="flex justify-end gap-2">{buttons}</div>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}

      <StatusNoteDialog
        open={dialog === "reschedule"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Suggest another time"
        description={`${tenant} asked for ${formatDateTime(viewing.preferredAt)}. They'll be notified of the new time.`}
        withDateTime
        noteLabel="Note"
        notePlaceholder="e.g. I'm only home after 5 pm on weekdays"
        submitLabel="Reschedule"
        pending={mutation.isPending}
        onSubmit={({ scheduledAt, note }) =>
          send(
            {
              status: "RESCHEDULED",
              scheduledAt: new Date(scheduledAt).toISOString(),
              ownerNote: note.trim() || undefined,
            },
            `Viewing moved to ${formatDateTime(new Date(scheduledAt))}`,
          )
        }
      />
      <StatusNoteDialog
        open={dialog === "reject"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Decline this viewing?"
        description={`${tenant} will be told the request was declined.`}
        noteLabel="Reason"
        notePlaceholder="e.g. The room has just been taken"
        submitLabel="Decline request"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          send(
            { status: "REJECTED", ownerNote: note.trim() || undefined },
            "Viewing request declined",
          )
        }
      />
      <StatusNoteDialog
        open={dialog === "cancel"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Cancel this viewing?"
        description="The owner will be told you're no longer coming."
        noteLabel="Reason"
        submitLabel="Cancel viewing"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          send(
            { status: "CANCELLED", reason: note.trim() || undefined },
            "Viewing cancelled",
          )
        }
      />
    </>
  );
}
