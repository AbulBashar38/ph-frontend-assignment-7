"use client";

import { Ban, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import StatusNoteDialog from "@/components/shared/status-note-dialog";
import { Button } from "@/components/ui/button";
import { useAuth, useUpdateUserStatus } from "@/hooks";
import type { User } from "@/types";
import { getErrorMessage } from "@/utils";

// Block (with a reason that's emailed to them) or reactivate; never yourself or the super admin
export default function UserRowActions({ user }: { user: User }) {
  const { user: me } = useAuth();
  const mutation = useUpdateUserStatus();
  const [dialog, setDialog] = useState<"block" | "activate" | null>(null);

  if (user.id === me?.id || user.role === "SUPER_ADMIN" || user.isDeleted) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const onDone = (message: string) => ({
    onSuccess: () => {
      toast.success(message);
      setDialog(null);
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      {user.status === "BLOCKED" ? (
        <Button
          size="xs"
          variant="outline"
          onClick={() => setDialog("activate")}
        >
          <UserCheck />
          Activate
        </Button>
      ) : (
        <Button
          size="xs"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setDialog("block")}
        >
          <Ban />
          Block
        </Button>
      )}

      <StatusNoteDialog
        open={dialog === "block"}
        onOpenChange={(open) => !open && setDialog(null)}
        title={`Block ${user.name}?`}
        description="They're signed out everywhere and can't log in until you activate them again. The reason is emailed to them."
        noteMinLength={3}
        noteLabel="Reason"
        notePlaceholder="e.g. Repeated fake listings reported by tenants"
        submitLabel="Block user"
        destructive
        pending={mutation.isPending}
        onSubmit={({ note }) =>
          mutation.mutate(
            {
              id: user.id,
              payload: { status: "BLOCKED", reason: note.trim() },
            },
            onDone(`${user.name} is blocked`),
          )
        }
      />
      <ConfirmDialog
        open={dialog === "activate"}
        onOpenChange={(open) => !open && setDialog(null)}
        title={`Activate ${user.name}?`}
        description="They can log in again straight away."
        confirmLabel="Activate"
        pending={mutation.isPending}
        onConfirm={() =>
          mutation.mutate(
            { id: user.id, payload: { status: "ACTIVE" } },
            onDone(`${user.name} can log in again`),
          )
        }
      />
    </>
  );
}
