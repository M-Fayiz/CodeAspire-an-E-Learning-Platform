import {z} from 'zod'

export const categorySchema=z.object({
    title:z
    .string()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(30, "Title must be within 150 characters"),
})