// app/api/properties/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proprietes = await prisma.property.findMany({
      include: {
        // Inclure des données supplémentaires si nécessaire
        ResidentialProperty: true,
        CommercialProperty: true,
        ParkingProperty: true,
        BoatProperty: true,
        LandProperty: true,
      },
    });

    return NextResponse.json(proprietes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Une erreur est survenue lors de la récupération des propriétés.' }, { status: 500 });
  }
}
