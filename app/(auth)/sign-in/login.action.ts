"use server";

import * as z from "zod";


import { LoginSchema } from "./login.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(values);
    return { error: "Invalid credential or email" };
  }

  const { email, password } = validatedFields.data;

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
    throw error;
  }
};
