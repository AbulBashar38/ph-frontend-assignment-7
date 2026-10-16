import z from "zod";

// Same limits as the backend (viewing.constant.ts MAX_DAYS_AHEAD, application.constant.ts MAX_MOVE_IN_DAYS_AHEAD)
export const MAX_VIEWING_DAYS_AHEAD = 90;
export const MAX_MOVE_IN_DAYS_AHEAD = 180;
const DAY_MS = 24 * 60 * 60 * 1000;

export const optionalNote = z
  .string()
  .trim()
  .max(500, "Message must be at most 500 characters long");

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// <input type="datetime-local"> value, e.g. "2026-11-05T16:00": a future time within the booking window
export const viewingTimeSchema = (emptyMessage: string) =>
  z
    .string()
    .min(1, emptyMessage)
    // Empty is already reported above, so the time checks only run on a real time
    .refine(
      (value) => !value || new Date(value).getTime() > Date.now(),
      "Pick a time in the future",
    )
    .refine(
      (value) =>
        !value ||
        new Date(value).getTime() <=
          Date.now() + MAX_VIEWING_DAYS_AHEAD * DAY_MS,
      `Viewings can be booked up to ${MAX_VIEWING_DAYS_AHEAD} days ahead`,
    );

export const viewingSchema = z.object({
  preferredAt: viewingTimeSchema("Pick a date and time"),
  message: optionalNote,
});

// <input type="date"> value, e.g. "2026-11-01"; occupants is capped by the room
export const applicationSchema = (maxOccupants: number) =>
  z.object({
    moveInDate: z
      .string()
      .min(1, "Pick a move-in date")
      // Empty is already reported above, so the date checks only run on a real date
      .refine(
        (value) => !value || new Date(`${value}T00:00:00`) >= startOfToday(),
        "Move-in date can't be in the past",
      )
      .refine(
        (value) =>
          !value ||
          new Date(`${value}T00:00:00`).getTime() <=
            Date.now() + MAX_MOVE_IN_DAYS_AHEAD * DAY_MS,
        `Move-in date must be within ${MAX_MOVE_IN_DAYS_AHEAD} days`,
      ),
    occupants: z
      .number("Enter how many people will live here")
      .int("Enter a whole number")
      .min(1, "At least 1 person")
      .max(
        maxOccupants,
        `This room fits at most ${maxOccupants} ${maxOccupants === 1 ? "person" : "people"}`,
      ),
    message: optionalNote,
  });
