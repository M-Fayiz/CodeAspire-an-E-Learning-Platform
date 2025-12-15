"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(4, "name must be atleast 4 charecters"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(10, "Phone number must be 10 digits"),
    role: zod_1.z.string(),
    password: zod_1.z
        .string()
        .min(8, "Password must be atleast 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must include uppercase, lowercase, number, and special character"),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
