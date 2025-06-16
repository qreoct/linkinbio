import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4().slice(0, 6);
  const expires = new Date(Date.now() + 1000 * 60 * 60); // valid for 1 hour

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
};
