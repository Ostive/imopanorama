// intsaller ts node : npm install ts-node --save-dev
// ajouter dans package.json: "prisma": {"seed": "ts-node prisma\\seed.ts"}
// Tapez "npx prisma db seed" pour mettre les données
// Regarder les données: npx prisma studio
// de ce fichier dans la BDD
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"; // Assurez-vous d'installer faker avec 'npm install @faker-js/faker'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Les données ont poussée avec succès.`);
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
