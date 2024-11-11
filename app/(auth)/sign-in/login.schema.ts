import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "a valid email is required" })
    .min(0, { message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(0, { message: "Password is required" }),
});
