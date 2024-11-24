import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "A valid email is required" })
    .min(1, { message: "Email is required" }) // Ensure it's not an empty string
    .transform((val) => val.toLowerCase()), // Normalize email to lowercase
  password: z.string().min(1, { message: "Password is required" }), // Minimum length 1 for validation
});
