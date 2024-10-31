import { prisma } from "@/lib/prisma";

export default async function Test() {
  const roles = await prisma.role.findMany();
  const users = await prisma.user.findMany();

  return (
    <div>
      <div>
        {roles.map((role) => (
          <li key={role.id}>{role.name}</li>
        ))}
      </div>

      <div>
        {users.map((user) => (
          <li key={user.id}>{user.first_name}</li>
        ))}
      </div>
    </div>
  );
}
