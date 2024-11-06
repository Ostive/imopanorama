"use client";

import { useState } from "react";
import { Ruler, Trees, Mountain, Sun, Droplet, Wifi, Waves } from "lucide-react";
import LandPropertyCard from "@/app/components/property/land/land-property-card";
import LandPropertyCardV2 from "@/app/components/property/land/land-property-cardV2";
export default function PropertyPage() {
  const [favorites, setFavorites] = useState(Array(100).fill(false));

  const toggleFavorite = (index) => {
    console.log(index)
    setFavorites((prevFavorites) =>
      prevFavorites.map((fav, i) => (i === index ? !fav : fav))
    );
  };

  const handleCardClick = (id: number) => {
    console.log(`Navigating to property details page for ID: ${id}`);
    // Votre logique de navigation ici
  };

  const landProperties = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    image: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=300&fit=crop",
      
    ],
    price: "180 000 €",
    address: "Toulouse, France",
    propertyType: "Terrain agricole",
    specificities: [
      { icon: Ruler, label: "Superficie", value: "7500 m²" },
      { icon: Trees, label: "Zonage", value: "Agricole" },
      { icon: Mountain, label: "Terrain", value: "Vallonné" },
      { icon: Waves, label: "Exposition", value: "300m de la plage" },
    ],
  }));

  return (
    <div className="grid gap-6 p-4 grid-cols-1 min-[540px]:grid-cols-2  min-[800px]:grid-cols-3 lg:grid-cols-3  min-[1440px]:grid-cols-4 min-[1680px]:grid-cols-5 min-[1980px]:grid-cols-5 ">
      {landProperties.map((property, index) => (
        <LandPropertyCardV2
          id={property.id}
          key={property.id}
          images={property.image}
          price={property.price}
          address={property.address}
          propertyType={property.propertyType}
          specificities={property.specificities}
          isFavorite={favorites[index]}
          onFavoriteChange={() => toggleFavorite(index)}
          handleCardClick={() => handleCardClick(property.id)} // Passage de la prop handleCardClick
        />
      ))}
    </div>
  );
}
