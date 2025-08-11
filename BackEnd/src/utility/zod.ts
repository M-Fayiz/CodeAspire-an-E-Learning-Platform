import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(4, "name must be atleast 4 charecters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be 10 digits"),
    role: z.string(),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
