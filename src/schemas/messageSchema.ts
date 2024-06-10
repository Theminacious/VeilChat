import {z} from 'zod'

export const acceptMessagesSchema = z.object({
    content:z
    .string()
    .min(10,"Content cannot be empty")
    .max(300,"Content must be less than 300 characters")
})