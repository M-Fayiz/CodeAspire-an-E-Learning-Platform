import {z} from 'zod'



const baseFields = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    "Password must include uppercase, lowercase, number, and special character"
  ),
    role:z.string(),
  name: z.string().min(4, "Name must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be 10 digits")
};

export const loginSchema=z.object({
    email:baseFields.email,
    password:baseFields.password
})

export const registrationSchema=z.object({
    ...loginSchema.shape,
    name:baseFields.name,
    phone:baseFields.phone,
    confirmPassword:z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

