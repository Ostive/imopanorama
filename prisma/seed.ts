import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"; // Assurez-vous d'installer faker avec 'npm install @faker-js/faker'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {

  // Créer les rôles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "customer" },
    update: {},
    create: {
      name: "customer",
    },
  });
  

  // Créer 100 utilisateurs
  for (let i = 0; i < 100; i++) {
    const role = i < 10 ? adminRole : customerRole; // First 10 are admin, the rest are customers
    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()
    await prisma.user.create({
      data: {
        name:  first_name +" "+ last_name,
        email: faker.internet.email(),
        emailVerified: faker.date.past(),
        password: await bcrypt.hash("password", 10),
        phoneNumber: faker.phone.number(),
        profilePhoto: faker.image.avatar(),
        roleId: role.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
