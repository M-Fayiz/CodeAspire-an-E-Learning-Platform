import { z } from "zod";
export const courseFormSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(150),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]),

  language: z.string().min(2, "Language is required"),

  thumbnail: z.union([
    z.string().min(1, "Thumbnail required"),
    z
      .instanceof(File)
      .refine(
        (file) => ["image/jpeg", "image/png"].includes(file.type),
        "Only JPEG and PNG are allowed",
      ),
  ]),

  categoryId: z.string().min(3, "Select a category"),

  subCategoryId: z.union([
    z.string().min(3, "Select a valid subcategory"),
    z.literal(""), // allow empty string
    z.undefined(),
  ]),

  price: z.number().min(1, "Price must be at least 1"),

  sessions: z.array(z.any()).optional(),
});

export const sessionSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(150, "Title must be within 150 characters"),
  // lectures:z.minLength(0,{message:'please add Lecture Contents'}).optional(),
});

export const lectureSchema = z.discriminatedUnion("lectureType", [
  z.object({
    title: z
      .string()
      .min(4, { message: "Title must be at least 4 characters" })
      .max(150, "Title must be within 150 characters"),
    lectureType: z.literal("video"),
    lectureContent: z.string().or(
      z.instanceof(File).refine((file) => file.type.startsWith("video/"), {
        message: "Only video files are allowed",
      }),
    ),
  }),
  z.object({
    title: z
      .string()
      .min(4, { message: "Title must be at least 4 characters" })
      .max(150, "Title must be within 150 characters"),
    lectureType: z.literal("pdf"),
    lectureContent: z.string().or(
      z.instanceof(File).refine((file) => file.type === "application/pdf", {
        message: "Only PDF files are allowed",
      }),
    ),
  }),
  z.object({
    title: z
      .string()
      .min(4, { message: "Title must be at least 4 characters" })
      .max(150, "Title must be within 150 characters"),
    lectureType: z.literal("none"),
    lectureContent: z.any().optional(),
  }),
]);
