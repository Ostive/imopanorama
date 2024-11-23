// actions/getProperties.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        photos: true, // Include related photos
        videos: true, // Include related videos
      },
    });
    return properties; // Return the list of properties
  } catch (error) {
    console.error("Error retrieving properties: ", error);
    throw new Error("Could not retrieve properties.");
  }
}


// actions/getResidentialProperties.js

export async function getResidentialProperties() {
  try {
    const properties = await prisma.residentialProperty.findMany({
      include: {
        property: {
          include: {
            photos: true,
            videos: true,
          },
        },
      },
    });
    return properties.map((resProp) => resProp.property); // Return only property details
  } catch (error) {
    console.error("Error retrieving residential properties: ", error);
    throw new Error('Could not retrieve residential properties.');
  }
}


export async function getCommercialProperties() {
  try {
    const properties = await prisma.commercialProperty.findMany({
      include: {
        property: {
          include: {
            photos: true,
            videos: true,
          },
        },
      },
    });
    return properties.map((comProp) => comProp.property); // Return only property details
  } catch (error) {
    console.error("Error retrieving commercial properties: ", error);
    throw new Error("Could not retrieve commercial properties.");
  }
}

export async function getBoatProperties() {
  try {
    const properties = await prisma.boatProperty.findMany({
      include: {
        property: {
          include: {
            photos: true,
            videos: true,
          },
        },
      },
    });
    return properties.map((boatProp) => boatProp.property); // Return only property details
  } catch (error) {
    console.error("Error retrieving boat properties: ", error);
    throw new Error("Could not retrieve boat properties.");
  }
}

export async function getParkingProperties() {
  try {
    const properties = await prisma.parkingProperty.findMany({
      include: {
        property: {
          include: {
            photos: true,
            videos: true,
          },
        },
      },
    });
    return properties.map((parkProp) => parkProp.property); // Return only property details
  } catch (error) {
    console.error("Error retrieving parking properties: ", error);
    throw new Error("Could not retrieve parking properties.");
  }
}


export async function getLandProperties() {
  try {
    const properties = await prisma.landProperty.findMany({
      include: {
        property: {
          include: {
            photos: true,
            videos: true,
          },
        },
      },
    });
    return properties.map((landProp) => landProp.property); // Return only property details
  } catch (error) {
    console.error("Error retrieving land properties: ", error);
    throw new Error("Could not retrieve land properties.");
  }
}