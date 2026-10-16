import { format } from "date-fns";
import z from "zod";
import type {
  Gender,
  LifestyleTag,
  Preference,
  RoommateProfilePayload,
  SleepSchedule,
} from "@/types";

// Same limits as the backend (roommate.validation.ts); inputs are strings/numbers from the form
const budget = (label: string) =>
  z
    .number(`Enter your ${label.toLowerCase()} budget`)
    .int("Use a whole number of taka")
    .min(500, `${label} budget must be at least ৳500`)
    .max(10_000_000, `${label} budget is too high`);

const optionalText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine(
      (value) => !value || (value.length >= min && value.length <= max),
      `${label} must be ${min}-${max} characters long`,
    );

export const roommateProfileSchema = z
  .object({
    gender: z
      .custom<Gender | "">()
      .refine(Boolean, "Choose your gender (used for matching)"),
    age: z
      .number("Enter your age")
      .int("Enter a whole number")
      .min(18, "You must be at least 18")
      .max(100, "Age must be at most 100"),
    occupation: optionalText("Occupation", 2, 60),
    budgetMin: budget("Minimum"),
    budgetMax: budget("Maximum"),
    preferredCity: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters long")
      .max(50, "City must be at most 50 characters long"),
    preferredArea: optionalText("Area", 2, 80),
    moveInDate: z
      .string()
      .min(1, "Pick a move-in date")
      .refine(
        (value) => !value || value >= format(new Date(), "yyyy-MM-dd"),
        "Move-in date can't be in the past",
      ),
    sleepSchedule: z.custom<SleepSchedule>(),
    smokingPreference: z.custom<Preference>(),
    petPreference: z.custom<Preference>(),
    genderPreference: z.custom<Gender | "">(),
    lifestyle: z.array(z.custom<LifestyleTag>()),
    bio: z.string().trim().max(1000, "Keep your bio under 1000 characters"),
  })
  .refine(
    (data) =>
      Number.isNaN(data.budgetMin) ||
      Number.isNaN(data.budgetMax) ||
      data.budgetMin <= data.budgetMax,
    {
      message: "Minimum budget can't be more than the maximum",
      path: ["budgetMin"],
    },
  );

export type RoommateProfileValues = z.input<typeof roommateProfileSchema>;

export function toRoommatePayload(
  values: RoommateProfileValues,
): RoommateProfilePayload {
  return {
    gender: values.gender as Gender,
    age: values.age,
    occupation: values.occupation.trim() || null,
    budgetMin: values.budgetMin,
    budgetMax: values.budgetMax,
    preferredCity: values.preferredCity.trim(),
    preferredArea: values.preferredArea.trim() || null,
    // A date, not a moment: noon UTC is the same calendar day in every timezone
    moveInDate: `${values.moveInDate}T12:00:00.000Z`,
    sleepSchedule: values.sleepSchedule,
    smokingPreference: values.smokingPreference,
    petPreference: values.petPreference,
    genderPreference: values.genderPreference || null,
    lifestyle: values.lifestyle,
    bio: values.bio.trim() || null,
  };
}
