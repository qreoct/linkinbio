"use server"

import { generateVerificationToken } from "@/lib/tokens"
import { loginSchema } from "@/schemas"
import * as z from "zod"

export async function sendOTP(formData: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: "Invalid email address" }
  }

  const { email } = validatedFields.data

  try {
    const otpCode = await generateVerificationToken(email)

    // TODO: Send OTP via email service here
    console.log(`OTP Code for ${email}: ${otpCode}`)

    return {
      success: true,
      message: "Verification code sent to your email",
    }
  } catch (error) {
    console.error("Failed to send OTP:", error)
    return { error: "Failed to send verification code. Please try again." }
  }
} 