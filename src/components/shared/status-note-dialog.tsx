"use client";

import type { ReactNode } from "react";
import StatusNoteForm from "@/components/form/status-note-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StatusNoteValues } from "@/validation";

// A status change that takes a note: reject, reschedule (with a new time), cancel
export default function StatusNoteDialog({
  open,
  onOpenChange,
  title,
  description,
  ...form
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  withDateTime?: boolean;
  noteMinLength?: number;
  noteLabel: string;
  notePlaceholder?: string;
  submitLabel: string;
  destructive?: boolean;
  pending: boolean;
  onSubmit: (values: StatusNoteValues) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !form.pending && onOpenChange(next)}
    >
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so it starts empty every time */}
        {open && (
          <StatusNoteForm {...form} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
