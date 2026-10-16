import z from "zod";
import { optionalNote, viewingTimeSchema } from "./booking.validation";

// A note or reason sent with a status change (the backend caps notes at 500 characters)
export const statusNoteSchema = z.object({
  note: optionalNote,
  scheduledAt: z.string(),
});

export const rescheduleSchema = z.object({
  note: optionalNote,
  scheduledAt: viewingTimeSchema("Pick the new date and time"),
});

export type StatusNoteValues = z.infer<typeof statusNoteSchema>;

// A required reason (ending a rental: 3+, blocking a user: 3+, suspending a listing: 5+ characters)
export const requiredNoteSchema = (min: number) =>
  z.object({
    note: z
      .string()
      .trim()
      .min(min, `Give a short reason (at least ${min} characters)`)
      .max(500, "Keep it under 500 characters"),
    scheduledAt: z.string(),
  });
