"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Heart, MapPin, Home, Bed, Bath, Ruler, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResidentialPropertyCardProps {
  id: string;
  images?: string[];
  price?: string;
  address?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  yearBuilt?: number;
  isFavorite?: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function ResidentialPropertyCard({
  id,
  images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&h=300&fit=crop",
  ],
  price = "350 000 €",
  address = "123 Rue de la Maison, 75001 Paris, France",
  propertyType = "Maison",
  bedrooms = 3,
  bathrooms = 2,
  area = "150 m²",
  yearBuilt = 2010,
  isFavorite = false,
  onFavoriteChange,
}: ResidentialPropertyCardProps) {
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const router = useRouter();

  useEffect(() => {
    setIsLocalFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (!(e.target as HTMLElement).closest("button")) {
        router.push(`/property/${id}`);
      }
    },
    [id, router]
  );

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      api?.scrollPrev();
    },
    [api]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      api?.scrollNext();
    },
    [api]
  );

  const renderPaginationDots = () => {
    const totalDots = 5;
    const totalImages = images.length;

    let startDot = Math.max(
      0,
      Math.min(currentSlide - 2, totalImages - totalDots)
    );
    let endDot = Math.min(startDot + totalDots, totalImages);

    if (endDot - startDot < totalDots) {
      startDot = Math.max(0, endDot - totalDots);
    }

    return Array.from(
      { length: endDot - startDot },
      (_, i) => i + startDot
    ).map((index) => (
      <button
        key={index}
        className={`w-2 h-2 rounded-full transition-colors ${
          index === currentSlide ? "bg-white" : "bg-white/50"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          api?.scrollTo(index);
        }}
        aria-label={`Go to image ${index + 1}`}
      />
    ));
  };

  return (
    <Card
      className="w-[300px] mx-auto overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-44 object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isHovered && (
            <>
              <CarouselPrevious
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 transition-colors rounded-full p-1"
                onClick={handlePrevious}
              />
              <CarouselNext
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 transition-colors rounded-full p-1"
                onClick={handleNext}
              />
            </>
          )}
        </Carousel>
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
          onClick={(e) => {
            e.stopPropagation();
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
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {renderPaginationDots()}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-primary mb-2">{price}</h3>
        <p className="text-muted-foreground flex items-center mb-3 text-sm">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-primary" />
            <span>{bedrooms} chambres</span>
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-primary" />
            <span>{bathrooms} salles de bain</span>
          </span>
          <span className="flex items-center">
            <Ruler className="h-4 w-4 mr-1 text-primary" />
            <span>{area}</span>
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span>Construit en {yearBuilt}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export { ResidentialPropertyCard };
