"use server";

import { db } from "@/lib/db"; // Your database client (e.g., Prisma)
import { updateUserSchema } from "@/schema/user";

// Fetch all users
export async function fetchUsers() {
  return await db.user.findMany();
}

// Update user
export async function updateUser(data: {
  id: string;
  name: string;
  email: string;
}) {
  const validatedData = updateUserSchema.parse(data); // Validate input
  return await db.user.update({
    where: { id: validatedData.id },
    data: validatedData,
  });
}

// Delete user
export async function deleteUser(userId: string) {
  return await db.user.delete({ where: { id: userId } });
}
