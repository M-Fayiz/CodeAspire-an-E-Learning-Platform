import { z } from "zod";

export const slotSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  slotDuration: z.number().min(1, "Select a valid duration"),
  pricePerSlot: z.number().min(1, "Enter a valid price"),

  selectedDays: z
    .array(
      z.object({
        day: z.string(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        active: z.boolean(),
      }),
    )
    .min(1, "Select at least one day"),
});

export default slotSchema;
