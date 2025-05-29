"use server"

import { loginSchema } from "@/schemas"

import * as z from "zod"

export async function login(formData: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  console.log(validatedFields.data)
  return { success: "Login successful" }
}