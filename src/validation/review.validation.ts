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

// Ending a rental early needs a reason (backend: 3–500 characters)
export const requiredNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Give a short reason (at least 3 characters)")
    .max(500, "Keep it under 500 characters"),
  scheduledAt: z.string(),
});
