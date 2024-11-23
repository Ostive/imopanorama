"use client";

import { LandPropertyCard } from "@/app/_components/property/land/land-property-card";

import { useState } from "react";
import { Heart, MapPin, Trees, Ruler, Mountain, Sun } from "lucide-react";

export function NewProperties() {
  const mockData = [
    {
      id: "1",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=500&h=500&fit=crop",
      ],
      price: "200 000 €",
      address: "Chemin de la Prairie, 67890 Région, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "3000 m²" },
        { icon: Trees, label: "Zonage", value: "Agricole" },
        { icon: Mountain, label: "Terrain", value: "Incliné" },
        { icon: Sun, label: "Exposition", value: "Est" },
      ],
      isFavorite: false,
    },
    {
      id: "2",
      images: [
        "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
      ],
      price: "350 000 €",
      address: "Rue de la Forêt, 45678 Village, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "4500 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: true,
    },
    {
      id: "3",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },

    {
      id: "4",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "5",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "6",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "7",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "8",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "9",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
    {
      id: "10",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
     
      ],
      price: "500 000 €",
      address: "Avenue des Pins, 75001 Paris, France",
      propertyType: "Terrain",
      specificities: [
        { icon: Ruler, label: "Superficie", value: "5000 m²" },
        { icon: Trees, label: "Zonage", value: "Résidentiel" },
        { icon: Mountain, label: "Terrain", value: "Plat" },
        { icon: Sun, label: "Exposition", value: "Sud" },
      ],
      isFavorite: false,
    },
  ];

  return (
    <section className="pt-24">
      <h1 className="text-3xl font-bold mb-8 text-center">New Properties</h1>
      <div className="flex pb-10 gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {mockData.map((property) => (
          <div key={property.id} className="flex-shrink-0 w-[300px] snap-start">
            <LandPropertyCard
              id={property.id}
              images={property.images}
              price={property.price}
              address={property.address}
              propertyType={property.propertyType}
              specificities={property.specificities}
              isFavorite={property.isFavorite}
              onFavoriteChange={(newState) =>
                console.log(`Property ${property.id} favorite state:`, newState)
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
