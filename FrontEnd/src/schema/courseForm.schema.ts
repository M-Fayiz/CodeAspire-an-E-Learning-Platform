import { z } from "zod";

export const courseFormSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(150, "Title must be within 150 characters"),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),

  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "please select given options",
  }),

  language: z.string().min(3, { message: "language is required" }),

  thumbnail: z.string().or(
    z
      .instanceof(File, { message: "Please choose a thumbnail" })
      .refine(
        (file) => file && ["image/jpeg", "image/png"].includes(file.type),
        {
          message: "Only JPEG and PNG files are allowed",
        },
      ),
  ),
  categoryId: z.string().min(3, { message: "select a category" }),

  subCategoryId: z
    .string()
    .min(3, { message: "Please select a subcategory" })
    .optional(),

  price: z.number().min(1, { message: "Price must be at least 1" }),
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
