import z from "zod";

// POST /roommate/requests: an optional note (backend: 1–500 characters when sent)
export const roommateRequestSchema = z.object({
  message: z.string().trim().max(500, "Keep the message under 500 characters"),
});
