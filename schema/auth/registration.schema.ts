//TODO 1: Create a more robust schema for registration by adding more validation rules

import * as z from "zod";

export const RegistrationSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" })
    .transform((val) => val.toLowerCase()), // Normalize email to lowercase
    password: z
      .string()
      // .min(1, { message: "Password must be at least 8 characters long" })
      // .regex(/[A-Z]/, {
      //   message: "Password must contain at least one uppercase letter",
      // })
      // .regex(/[a-z]/, {
      //   message: "Password must contain at least one lowercase letter",
      // })
      // .regex(/[0-9]/, { message: "Password must contain at least one number" })
      // .regex(/[@$!%*?&#.]/, {
      //   message: "Password must contain at least one special character",
      // })
      ,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
