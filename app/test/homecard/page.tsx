"use client";

import { PropertyCard } from "@/app/components/property/residentialpropertycard";
import { MadagascarLandPropertyCard } from "@/app/components/property/madagascarlandpropertycard";
import { useState } from "react";

export default function Homecard() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      <PropertyCard
        imageUrl="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        price="425 000 €"
        address="456 Rue des Érables, Ville, France"
        bedrooms={4}
        bathrooms={4}
        squareFeet={1080}
        propertyType="Appartement"
        isFavorite={isFavorite}
        onFavoriteChange={(newState) => {
          setIsFavorite(newState);
          // Autres actions si nécessaire, comme sauvegarder l'état dans une base de données
        }}
      />

      <MadagascarLandPropertyCard
        imageUrl="https://images.pexels.com/photos/3099112/pexels-photo-3099112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        price="100 000 000 Ar"
        address="Plage d'Ambodiatafana, Île Sainte-Marie, Région Analanjirofo, Madagascar"
        area={3000}
        zoning="Touristique"
        terrain="Côtier sablonneux"
        propertyType="Terrain balnéaire"
        beachProximity={{ type: "direct" }}
        // ... autres props
      />

      <MadagascarLandPropertyCard
        imageUrl="https://images.pexels.com/photos/3099112/pexels-photo-3099112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        price="80 000 000 Ar"
        address="Route de la Plage, Île Sainte-Marie, Région Analanjirofo, Madagascar"
        area={2500}
        zoning="Résidentiel"
        terrain="Plat"
        propertyType="Terrain constructible"
        beachProximity={{ type: "near", distance: "500 m" }}
        // ... autres props
      />

      <MadagascarLandPropertyCard
        imageUrl="https://images.pexels.com/photos/3099112/pexels-photo-3099112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        price="50 000 000 Ar"
        address="Centre-ville, Île Sainte-Marie, Région Analanjirofo, Madagascar"
        area={1800}
        zoning="Commercial"
        terrain="Urbain"
        propertyType="Terrain commercial"
        beachProximity={{ type: "far", distance: "3 km" }}
        // ... autres props
      />
    </div>
  );
}