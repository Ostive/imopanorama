"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface PropertyCardProps {
  imageUrl?: string;
  price?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  propertyType?: string;
  isFavorite?: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function PropertyCard({
  imageUrl = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
  price = "350 000 €",
  address = "123 Rue Principale, Ville, France",
  bedrooms = 3,
  bathrooms = 2,
  squareFeet = 140,
  propertyType = "Maison",
  isFavorite = false,
  onFavoriteChange,
}: PropertyCardProps) {
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setIsLocalFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Propriété"
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {propertyType}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full p-2 ${
            isLocalFavorite ? "bg-white" : "bg-white/50 hover:bg-white/75"
          } transition-colors`}
          aria-label={
            isLocalFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
          onClick={() => {
            const newState = !isLocalFavorite;
            setIsLocalFavorite(newState);
            onFavoriteChange?.(newState);
          }}
        >
          <Heart
            className={`h-5 w-5 ${
              isLocalFavorite ? "text-red-500 fill-red-500" : "text-primary"
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="text-2xl font-bold text-primary mb-4">{price}</h3>
        <p className="text-muted-foreground flex items-center mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {address}
        </p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {bedrooms} Ch.
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {bathrooms} SdB
          </span>
          <span className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {squareFeet} m²
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button className="w-full">Voir les détails</Button>
      </CardFooter>
    </Card>
  );
}

export { PropertyCard };