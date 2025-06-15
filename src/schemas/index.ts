import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
})

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})