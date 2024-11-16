// intsaller ts node : npm install ts-node --save-dev
// ajouter dans package.json: "prisma": {"seed": "ts-node prisma\\seed.ts"}
// Tapez "npx prisma db seed" pour mettre les données
// Regarder les données: npx prisma studio 
// de ce fichier dans la BDD
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker"; // Assurez-vous d'installer faker avec 'npm install @faker-js/faker'
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import fs from "fs";
import path from "path"

const prisma = new PrismaClient();

async function main() {

  // Suppression des tables dépendantes d'abord
  await prisma.residentialProperty.deleteMany();
  await prisma.commercialProperty.deleteMany();
  await prisma.landProperty.deleteMany();
  await prisma.boatProperty.deleteMany();
  await prisma.parkingProperty.deleteMany();

  // Suppression des tables de base
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // Créez des utilisateurs avec les rôles assignés directement
  const user1 = await prisma.user.create({
    data: {
      name: 'John',
      email: 'john@example.com',
      password: await argon2.hash('password123'),
      phone_number: '123456789',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane',
      email: 'jane@example.com',
      password: await argon2.hash('password123'),
      phone_number: '987654321',

    },
  });

  // Utilitaire pour générer des propriétés aléatoires
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;


   // Lire l'image en binaire
  const imagePath1 = path.join(__dirname, '/imgseed/maison1.jpg'); // Spécifiez le chemin de votre image
  const image1 = fs.readFileSync(imagePath1)
  const imagePath2 = path.join(__dirname, '/imgseed/maison2.jpg'); // Spécifiez le chemin de votre image
  const image2 = fs.readFileSync(imagePath2)
  const imagePath3 = path.join(__dirname, '/imgseed/maison3.jpg'); // Spécifiez le chemin de votre image
  const image3 = fs.readFileSync(imagePath3)

  //console.log(""+image1);


  // Créez des propriétés avec des utilisateurs assignés
  for (let i = 0; i < 30; i++) {
    const userId = i % 2 === 0 ? user1.id : user2.id; // Alterne entre les utilisateurs

    // Création de propriétés résidentielles
    if (i < 10) {
      await prisma.property.create({
        data: {
          title: `Maison familiale ${i + 1}`,
          type: 'residential',
          location: `Ville ${getRandomInt(1, 10)}`,
          price: getRandomInt(100000, 1000000),
          description: 'Une belle maison spacieuse avec un grand jardin.',
          userId: userId,
          images: [image1,image2,image3],
          ResidentialProperty: {
            create: {
              bedrooms: getRandomInt(1, 5),
              bathrooms: getRandomInt(1, 3),
              living_space: getRandomInt(100, 300),
              built_year: getRandomInt(1980, 2020),
              floors: getRandomInt(1, 3),
            },
          },
        },
      });
    }
    // Création de propriétés commerciales
    else if (i < 20) {
      await prisma.property.create({
        data: {
          title: `Bureau moderne ${i - 9}`,
          type: 'commercial',
          location: `Ville ${getRandomInt(1, 10)}`,
          price: getRandomInt(200000, 500000),
          description: 'Espace de bureaux moderne dans le centre-ville.',
          userId: userId,
          images: [image1,image2,image3],
          CommercialProperty: {
            create: {
              rooms: getRandomInt(5, 15),
              commercial_space: getRandomInt(100, 500),
            },
          },
        },
      });
    }
    // Création de propriétés de terrain
    else if (i < 25) {
      await prisma.property.create({
        data: {
          title: `Land ${i - 19}`,
          type: 'land',
          location: `Ville ${getRandomInt(1, 10)}`,
          price: getRandomInt(50000, 300000),
          description: 'Un beau terrain à bâtir.',
          userId: userId,
          images: [image1,image2,image3],
          LandProperty: {
            create: {
              land_area: getRandomInt(100, 1000),
            },
          },
        },
      });
    }
    // Création de propriétés de bateau
    else if (i < 28) {
      await prisma.property.create({
        data: {
          title: `Bateau ${i - 24}`,
          type: 'boat',
          location: `Port ${getRandomInt(1, 5)}`,
          price: getRandomInt(10000, 200000),
          description: 'Un bateau magnifique prêt pour la navigation.',
          userId: userId,
          images: [image1,image2,image3],
          BoatProperty: {
            create: {
              length: getRandomInt(15, 50),
              boat_type: 'Vieux gréement',
            },
          },
        },
      });
    }
    // Création de propriétés de stationnement
    else {
      await prisma.property.create({
        data: {
          title: `Stationnement ${i - 27}`,
          type: 'parking',
          location: `Zone ${getRandomInt(1, 10)}`,
          price: getRandomInt(5000, 30000),
          description: 'Un stationnement sécurisé.',
          userId: userId,
          images: [image1,image2,image3],
          ParkingProperty: {
            create: {
              parking_type: 'Privé',
              size: getRandomInt(15, 30),
            },
          },
        },
      });
    }
  }

  console.log(`🌱 Les données de semence ont été créées avec succès.`);
  
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
