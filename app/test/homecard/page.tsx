"use client";

import { useState } from "react";
import { Ruler, Trees, Mountain, Sun, Droplet, Wifi } from "lucide-react";
import LandPropertyCard from "@/app/components/property/land-property-card";

export default function PropertyPage() {
  const [favorites, setFavorites] = useState(Array(100).fill(false));

  const toggleFavorite = (index) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((fav, i) => (i === index ? !fav : fav))
    );
  };

  const landProperties = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    image: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=500&h=300&fit=crop",
    ],
    price: "180 000 €",
    address: "Chemin des Vignes, 34567 Campagne, France",
    propertyType: "Terrain agricole",
    specificities: [
      { icon: Ruler, label: "Superficie", value: "7500 m²" },
      { icon: Trees, label: "Zonage", value: "Agricole" },
      { icon: Mountain, label: "Terrain", value: "Vallonné" },
      { icon: Sun, label: "Exposition", value: "Sud-Ouest" },
    ],
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
      {landProperties.map((property, index) => (
        <LandPropertyCard
          key={property.id}
          images={property.image}
          price={property.price}
          address={property.address}
          propertyType={property.propertyType}
          specificities={property.specificities}
          isFavorite={favorites[index]}
          onFavoriteChange={() => toggleFavorite(index)}
        />
      ))}
    </div>
  );
}
