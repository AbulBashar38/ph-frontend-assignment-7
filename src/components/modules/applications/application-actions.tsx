"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import StatusNoteDialog from "@/components/shared/status-note-dialog";
import { Button } from "@/components/ui/button";
import { useAuth, useUpdateApplicationStatus } from "@/hooks";
import type { ApplicationListItem, ApplicationStatusPayload } from "@/types";
import { formatCurrency, getErrorMessage } from "@/utils";

type Dialog = "approve" | "reject" | "cancel";

// PENDING → APPROVED | REJECTED (owner/admin) | CANCELLED (tenant); an expired one can't be approved
export default function ApplicationActions({
  application,
}: {
  application: ApplicationListItem;
}) {
  const { isTenant, isOwner, isAdmin } = useAuth();
  const mutation = useUpdateApplicationStatus();
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const pending = application.status === "PENDING";
  const expired = new Date(application.expiresAt).getTime() <= Date.now();
  const canReview = (isOwner || isAdmin) && pending;
  const tenant = application.tenant.name.split(" ")[0];

  const send = (payload: ApplicationStatusPayload, message: string) =>
    mutation.mutate(
      { id: application.id, payload },
      {
        onSuccess: () => {
          toast.success(message);
          setDialog(null);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );

  const buttons = [];
  if (canReview && !expired) {
    buttons.push(
      <Button key="approve" size="xs" onClick={() => setDialog("approve")}>
        <Check />
        Approve
      </Button>,
    );
  }
  if (canReview) {
    buttons.push(
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
  if (isTenant && pending) {
    buttons.push(
      <Button
        key="cancel"
        size="xs"
        variant="outline"
        onClick={() => setDialog("cancel")}
      >
        <X />
        Withdraw
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

      <ConfirmDialog
        open={dialog === "approve"}
        onOpenChange={(next) => !next && setDialog(null)}
        title={`Approve ${tenant}'s application?`}
        description={`${application.room.name} is reserved for ${tenant} and a rental is opened at ${formatCurrency(application.room.monthlyRent)} a month. It becomes active once the first rent is paid. Other pending applications for this room are declined.`}
        confirmLabel="Approve"
        pending={mutation.isPending}
        onConfirm={() =>
          send(
            { status: "APPROVED" },
            `Approved. ${tenant} can now pay the first month`,
          )
        }
      />
      <StatusNoteDialog
        open={dialog === "reject"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Decline this application?"
        description={`${tenant} will be told the application was declined.`}
        noteLabel="Reason"
        notePlaceholder="e.g. We're looking for a single occupant"
        submitLabel="Decline application"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          send(
            { status: "REJECTED", rejectionReason: note.trim() || undefined },
            "Application declined",
          )
        }
      />
      <StatusNoteDialog
        open={dialog === "cancel"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Withdraw this application?"
        description="The owner will be told you're no longer interested."
        noteLabel="Reason"
        submitLabel="Withdraw"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          send(
            { status: "CANCELLED", reason: note.trim() || undefined },
            "Application withdrawn",
          )
        }
      />
    </>
  );
}
