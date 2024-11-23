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
import { Heart, MapPin, Home, Ruler, BedDouble, Bath, Car } from "lucide-react";
import { useRouter } from "next/navigation";

interface Specificity {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface ResidentialPropertyCardProps {
  id: string;
  images?: string[];
  price?: string;
  address?: string;
  propertyType?: string;
  specificities: Specificity[];
  isFavorite?: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function Component({
  id = "1",
  images = [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=800&fit=crop",
  ],
  price = "350 000 €",
  address = "123 Rue de la Paix, 75000 Paris, France",
  propertyType = "Maison",
  specificities = [
    { icon: Home, label: "Type", value: "individuelle" },
    { icon: Ruler, label: "Surface", value: "150 m²" },
    { icon: BedDouble, label: "Chambres", value: "4" },
    { icon: Bath, label: "Salles de bain", value: "2" },
  ],
  isFavorite = false,
  onFavoriteChange = () => {},
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
      className="w-full sm:w-[550px] mx-auto overflow-hidden cursor-pointer shadow-none border-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex flex-col">
        <div className="relative w-full">
          <Carousel
            className="w-full aspect-square rounded-lg overflow-hidden"
            setApi={setApi}
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {(isHovered ||
              (typeof window !== "undefined" && window.innerWidth < 640)) && (
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
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-primary mb-2">{price}</h3>
          <p className="text-muted-foreground flex items-center mb-4 text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {specificities.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <span key={index} className="flex items-center font-medium">
                  <IconComponent className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-primary">{spec.value}</span>
                </span>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
