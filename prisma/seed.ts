import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"; // Assurez-vous d'installer faker avec 'npm install @faker-js/faker'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {

  // Créer des utilisateurs
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), 10),
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
