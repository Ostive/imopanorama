'use client'

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Bed, Bath, Maximize, Car, SquareIcon as SquareFoot } from 'lucide-react'

type PropertyType = 'residential' | 'commercial' | 'parking' | 'land' | 'boat' | 'other';

interface ProprietesProps {
  id: number;
  titre: string;
  adresse: string;
  images: { type: string; data: number[] }[];
  description: string;
  prix: number;
  type: string;
  residential?: {
    bedrooms: number;
    bathrooms: number;
    living_space: number;
    built_year: number;
    floors: number;
  };
  commercial?: {
    rooms: number;
    commercial_space: number;
  };
  parking?: {
    parking_type: string;
    size: number;
  };
  land?: {
    land_area: number;
  };
  boat?: {
    length: number;
    boat_type: string;
  };
}

export default function Proprietes({
  titre,
  adresse,
  images,
  description,
  prix,
  type,
  residential,
  commercial,
  parking,
  land,
  boat,
}: ProprietesProps) {

  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Index de l'image active

  useEffect(() => {
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

  const totalImages = base64Images.length; // Total d'images disponibles

  const handleNext = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % totalImages); // Boucle vers la première image
  };

  const handlePrevious = () => {
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages); // Boucle vers la dernière image
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <Carousel>
        <CarouselContent>
          {base64Images.map((src, index) => (
            <CarouselItem key={index}>
              {src ? (
                <div className="relative">
                  <img
                    src={src}
                    alt={`${titre} - Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  {/* Affichage du compteur d'images */}
                  <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs">
                    <span>{index + 1} sur {totalImages}</span>
                  </div>
                </div>
              ) : (
                <p>Image non disponible</p>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} />
        <CarouselNext onClick={handleNext} />
      </Carousel>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{titre}</CardTitle>
          <p className="text-muted-foreground">{adresse}</p>
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
                <span>{commercial.commercial_space} m² d'espace commercial</span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-primary" />
                <span>{commercial.rooms} pièces</span>
              </div>
            </>
          )}
          {parking && (
            <div className="flex items-center">
              <Car className="h-5 w-5 mr-2 text-primary" />
              <span>{parking.parking_type}, {parking.size} m²</span>
            </div>
          )}
          {land && (
            <div className="flex items-center">
              <SquareFoot className="h-5 w-5 mr-2 text-primary" />
              <span>{land.land_area} m² de terrain</span>
            </div>
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
  )
}
