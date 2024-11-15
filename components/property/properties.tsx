'use client'

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Bed, Bath, Maximize, Car, SquareIcon as SquareFoot } from 'lucide-react'

// Définir un type pour le type de la propriété
type PropertyType = 'residential' | 'commercial' | 'parking' | 'land' | 'boat' | 'other';

interface ProprietesProps {
  id: number;
  titre: string;
  adresse: string;
  images: { type: string; data: number[] }[];
  description: string;
  prix: number;
  type: string; // Ajouter le type de la propriété
  residential?: {
    bedrooms: number;      // Nombre de chambres
    bathrooms: number;     // Nombre de salles de bain
    living_space: number;  // Surface habitable en m²
    built_year: number;    // Année de construction
    floors: number;        // Nombre d'étages
  };
  commercial?: {
    rooms: number;
    commercialSpace: number;
  };
  parking?: {
    parking_type: string;
    size: number;
  };
  land?: {
    surface: number;
  };
  boat?: {
    length: number;      // Longueur du bateau
    boat_type: string;   // Type de bateau
  };
}

export default function Proprietes({
  titre,
  adresse,
  images,
  description,
  prix,
  type, // Ajouter le type ici
  residential,
  commercial,
  parking,
  land,
  boat,  // Ajout de la propriété boat
}: ProprietesProps) {
  //console.log(residential);

  const [base64Images, setBase64Images] = useState<string[]>([]);

  useEffect(() => {
    // Vérifier si `images` est défini et est un tableau
    //console.log(images[0]);
    if (images && Array.isArray(images)) {
      const convertedImages = images.map((image) => {
        const byteArray = new Uint8Array(image.data);
        const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        const base64String = window.btoa(binaryString);
        return `data:image/jpeg;base64,${base64String}`;
      });
      setBase64Images(convertedImages);
    }
  }, [images]);
  

  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <Carousel>
        <CarouselContent>
        {base64Images.map((src, index) => (
            <CarouselItem key={index}>
            {src ? (
              <img
                src={src}
                alt={`${titre} - Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            ) : (
              <p>Image non disponible</p>
            )}
          </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{titre}</CardTitle>
          <p className="text-muted-foreground">{adresse}</p>
          {/* Afficher le type de propriété */}
          <p className="text-muted-foreground text-sm">{type}</p>
        </div>
        <Badge variant="secondary" className="text-lg font-semibold">
            ${prix.toLocaleString()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {residential && (
            <>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-primary" />
                <span>{residential.bedrooms} chambres</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-primary" />
                <span>{residential.bathrooms} salles de bain</span>
              </div>
              <div className="flex items-center">
                <SquareFoot className="h-5 w-5 mr-2 text-primary" />
                <span>{residential.living_space} m²</span>
              </div>
              <div className="flex items-center">
                <span>{residential.floors} étages</span>
              </div>
            </>
          )}
          {commercial && (
            <>
              <div className="flex items-center">
                <SquareFoot className="h-5 w-5 mr-2 text-primary" />
                <span>{commercial.commercialSpace} m² d'espace commercial</span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-primary" />
                <span>{commercial.rooms} pièces</span>
              </div>
            </>
          )}
          {parking && (
            <>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                <span>{parking.parking_type}, {parking.size} m²</span>
              </div>
            </>
          )}
          {land && (
            <>
              <div className="flex items-center">
                <SquareFoot className="h-5 w-5 mr-2 text-primary" />
                <span>{land.surface} m² de terrain</span>
              </div>
            </>
          )}
          {boat && (
            <>
              <div className="flex items-center">
                <SquareFoot className="h-5 w-5 mr-2 text-primary" />
                <span>Longueur : {boat.length} m</span>
              </div>
              <div className="flex items-center">
                <Maximize className="h-5 w-5 mr-2 text-primary" />
                <span>Type de bateau : {boat.boat_type}</span>
              </div>
            </>
          )}
        </div>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
