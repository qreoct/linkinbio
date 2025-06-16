import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export async function authorizeCredentials(
  credentials: Record<string, unknown>
) {
  const validatedFields = credentialsSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return null;
  }

  const { email, code } = validatedFields.data;

  // Get the verification token for this email
  const verificationToken = await getVerificationTokenByEmail(email);

  if (!verificationToken) {
    return null;
  }

  // Check if token has expired
  if (new Date() > verificationToken.expires) {
    return null;
  }

  // Check if the provided code matches the token
  if (verificationToken.token !== code) {
    return null;
  }

  // Get or create user
  let user = await getUserByEmail(email);

  if (!user) {
    // Create new user if doesn't exist
    user = await db.user.create({
      data: {
        name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""),
        email,
        emailVerified: new Date(),
        role: "USER",
      },
    });
  }

  // Clean up the used verification token
  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };
}
