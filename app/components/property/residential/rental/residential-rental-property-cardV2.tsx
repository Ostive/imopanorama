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
import {
  Heart,
  MapPin,
  Home,
  Bed,
  Bath,
  Ruler,
  Star,
  StarHalf,
  BedDouble,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ResidentialRentalPropertyCardProps {
  id: string;
  images?: string[];
  price: string;
  priceType: "night" | "month";
  address?: string;
  propertyType?: string;
  specificities: Array<{
    icon: React.ElementType;
    label: string;
    value: string;
  }>;
  rating?: number;
  isFavorite?: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function ResidentialRentalPropertyCard({
  id,
  images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop",
  ],
  price = "1 000 000",
  priceType,
  address = "123 Rue de la Location, 75001 Paris, France",
  propertyType = "Appartement",
  specificities = [
    { icon: Home, label: "Type", value: "Studio" },
    { icon: Ruler, label: "Surface", value: "30 m²" },
    { icon: BedDouble, label: "Chambres", value: "1" },
    { icon: Bath, label: "Salles de bain", value: "1" },
  ],
  rating = 4.5,
  isFavorite = false,
  onFavoriteChange,
}: ResidentialRentalPropertyCardProps) {
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
        router.push(`/rental/${id}`);
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

  const renderRating = () => (
    <div className="flex items-center">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
      <span className="text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );

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
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-primary">
              {price}€{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {priceType === "night" ? "nuit" : "mois"}
              </span>
            </h3>
            {renderRating()}
          </div>
          <p className="text-muted-foreground flex items-center mb-3 text-sm">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {specificities.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <span key={index} className="flex items-center">
                  <IconComponent className="h-4 w-4 mr-1 text-primary" />
                  <span>{spec.value}</span>
                </span>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export { ResidentialRentalPropertyCard };
