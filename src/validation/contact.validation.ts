import z from "zod";
import { emailSchema, nameSchema } from "./auth.validation";

// Same rules as the backend's ContactValidationZodSchema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters long")
    .max(120, "Subject must be at most 120 characters long"),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters long")
    .max(2000, "Message must be at most 2000 characters long"),
});
