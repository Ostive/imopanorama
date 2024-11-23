"use server";

import * as z from "zod";


import { LoginSchema } from "./login.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { generateVerificationToken } from "@/data/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";



export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(values);
    return { error: "Invalid credential or email" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password)
  {
    return {error:"Email does not exist!"};
  }

  if(!existingUser.emailVerified)
  {
    const verificationToken = await generateVerificationToken(existingUser.email);

    //Send verification email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {error:"Email not verified! Check your email for verification link."};
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {

    if (error instanceof AuthError) {
      switch(error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error:"Something went wrong!" };
      }
    }
    return error;
  }
};
