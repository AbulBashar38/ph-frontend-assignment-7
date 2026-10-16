"use client";

import ConfirmDialog from "@/components/shared/confirm-dialog";

export default function RemovePropertyDialog({
  open,
  onOpenChange,
  title,
  pending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Remove "${title}"?`}
      description="The listing and its rooms leave search, and open viewing requests and applications are cancelled. Listings with reserved or occupied rooms can't be removed."
      confirmLabel="Remove listing"
      destructive
      pending={pending}
      onConfirm={onConfirm}
    />
  );
}
