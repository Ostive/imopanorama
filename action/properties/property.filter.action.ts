"use server";

import prisma from "@/lib/prisma"; // Ensure this points to your Prisma client initialization

interface FilterParams {
  global?: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    type?: string; // e.g., RESIDENTIAL, COMMERCIAL, BOAT, etc.
    status?: string; // e.g., AVAILABLE, SOLD
    ownershipType?: string; // e.g., AGENCY, PRIVATE
  };
  residential?: {
    bedrooms?: number;
    bathrooms?: number;
    minLivingSpace?: number;
    maxLivingSpace?: number;
    builtYear?: number;
    equippedKitchen?: boolean;
    garage?: boolean;
    garden?: boolean;
    pool?: string; // e.g., INDOOR, OUTDOOR
  };
  commercial?: {
    minArea?: number;
    maxArea?: number;
    numberOfWorkspaces?: number;
    zoningCompliance?: boolean;
  };
  parking?: {
    minSize?: number;
    maxSize?: number;
    parkingType?: string; // e.g., OUTDOOR, INDOOR
    boxPresent?: boolean;
    electrification?: string;
  };
  boat?: {
    minLength?: number;
    maxLength?: number;
    boatType?: string; // e.g., SAILBOAT, YACHT
    engineType?: string;
    licenseRequired?: boolean;
  };
  land?: {
    minArea?: number;
    maxArea?: number;
    zoning?: string; // e.g., RESIDENTIAL, COMMERCIAL
    topography?: string;
    accessibility?: string;
    vegetation?: string;
    soilType?: string;
  };
}

export async function getFilteredProperties(filters: FilterParams) {
  const { global, residential, commercial, parking, boat, land } = filters;

  // Base query with global filters
  const where: any = {
    price: {
      gte: global?.minPrice || undefined,
      lte: global?.maxPrice || undefined,
    },
    location: global?.location
      ? { contains: global.location, mode: "insensitive" }
      : undefined,
    type: global?.type || undefined,
    status: global?.status || undefined,
    ownershipType: global?.ownershipType || undefined,
  };

  // Type-specific filters
  if (residential) {
    where.ResidentialProperty = {
      bedrooms: residential.bedrooms || undefined,
      bathrooms: residential.bathrooms || undefined,
      livingSpace: {
        gte: residential.minLivingSpace || undefined,
        lte: residential.maxLivingSpace || undefined,
      },
      builtYear: residential.builtYear || undefined,
      equippedKitchen: residential.equippedKitchen || undefined,
      garage: residential.garage || undefined,
      pool: residential.pool || undefined,
    };
  }

  if (commercial) {
    where.CommercialProperty = {
      totalArea: {
        gte: commercial.minArea || undefined,
        lte: commercial.maxArea || undefined,
      },
      numberOfWorkspaces: commercial.numberOfWorkspaces || undefined,
      zoningCompliance: commercial.zoningCompliance || undefined,
    };
  }

  if (parking) {
    where.ParkingProperty = {
      size: {
        gte: parking.minSize || undefined,
        lte: parking.maxSize || undefined,
      },
      parkingType: parking.parkingType || undefined,
      boxPresent: parking.boxPresent || undefined,
      electrification: parking.electrification || undefined,
    };
  }

  if (boat) {
    where.BoatProperty = {
      length: {
        gte: boat.minLength || undefined,
        lte: boat.maxLength || undefined,
      },
      boatType: boat.boatType || undefined,
      engineType: boat.engineType || undefined,
      licenseRequired: boat.licenseRequired || undefined,
    };
  }

  if (land) {
    where.LandProperty = {
      landArea: {
        gte: land.minArea || undefined,
        lte: land.maxArea || undefined,
      },
      zoning: land.zoning || undefined,
      topography: land.topography || undefined,
      accessibility: land.accessibility || undefined,
      vegetation: land.vegetation || undefined,
      soilType: land.soilType || undefined,
    };
  }

  // Fetch properties
  return await prisma.property.findMany({
    where,
    include: {
      ResidentialProperty: true,
      CommercialProperty: true,
      ParkingProperty: true,
      BoatProperty: true,
      LandProperty: true,
    },
    orderBy: { createdAt: "desc" }, // Example ordering
  });
}
