import {z} from "zod"

export const userSchema=z.object({
    email:z.string().email("invalid email address"),
    password:z.string()
})