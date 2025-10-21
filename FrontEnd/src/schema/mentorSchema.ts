import { z } from "zod";

export const mentorSchema = z.object({
  expertise: z
    .array(z.string())
    .nonempty({ message: "At least one expertise is required" }),
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters long" }),
  experience: z.coerce
    .number()
    .min(1, { message: "Experience must be at least 1 year" }),
  socialLinks: z.object({
    linkedIn: z.string().url({ message: "Invalid LinkedIn URL" }),
    github: z.string().url({ message: "Invalid GitHub URL" }),
    portfolio: z.string().url({ message: "Invalid Portfolio URL" }),
  }),
  resume: z
    .instanceof(File, { message: "You must upload a PDF file" })
    .refine((file) => file.type === "application/pdf", {
      message: "Resume must be a PDF file",
    })
    .refine((file) => file.size > 0, {
      message: "Uploaded file cannot be empty",
    }),
});
