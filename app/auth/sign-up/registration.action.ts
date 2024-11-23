"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import * as z from "zod";
import { RegistrationSchema } from "./registration.schema";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/token";

import { sendVerificationEmail } from "@/lib/mail";

export const registration = async (
  values: z.infer<typeof RegistrationSchema>
) => {
  const validatedFields = RegistrationSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(values);
    return { error: "Invalid credential or email" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists" };
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

// send verification email
const verificationToken = await generateVerificationToken(email);
await sendVerificationEmail(verificationToken.email, verificationToken.token);

return { success: "Confirmation email sent!" };
};
