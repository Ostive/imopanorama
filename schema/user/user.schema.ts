import { z } from "zod";

export const getUserSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});
