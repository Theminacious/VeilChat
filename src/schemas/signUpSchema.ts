import {z} from 'zod'

export const usernameValidation = z
.string()
.min(3, {message: "Username must be at least 3 characters"})
.max(20, {message: "Username must be less than 20 characters"})
.regex(/^[a-zA-Z0-9_]+$/, {message: "Username can only contain letters and numbers"})

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email address"}),
    password:z.string().min(6, {message: "Email must be at least 6 characters"})
})