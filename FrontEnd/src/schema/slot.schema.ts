import { z } from "zod";

const slotSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  selectedDays: z.array(z.string()).min(1, "Select at least one day"),
  slotDuration: z.number().min(1, "Select a valid duration"),
  pricePerSlot: z.number().min(1, "Enter valid price"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export default slotSchema;
