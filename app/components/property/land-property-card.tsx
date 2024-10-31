import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Trees,
  Ruler,
  Mountain,
  Sun,
  Droplet,
  Wifi,
  Car,
} from "lucide-react";

interface Specificity {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface LandPropertyCardProps {
  imageUrl?: string;
  price?: string;
  address?: string;
  propertyType?: string;
  specificities: Specificity[];
  isFavorite?: boolean;
  onFavoriteChange?: (newState: boolean) => void;
}

export default function LandPropertyCard({
  imageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
  price = "150 000 €",
  address = "Route des Champs, 12345 Ville, France",
  propertyType = "Terrain",
  specificities = [
    { icon: Ruler, label: "Superficie", value: "5000 m²" },
    { icon: Trees, label: "Zonage", value: "Résidentiel" },
    { icon: Mountain, label: "Terrain", value: "Plat" },
    { icon: Sun, label: "Exposition", value: "Sud" },
    { icon: Sun, label: "Exposition", value: "Sud" },
  ],
  isFavorite = false,
  onFavoriteChange,
}: LandPropertyCardProps) {
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);

  useEffect(() => {
    setIsLocalFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Terrain"
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
        <h3 className="text-2xl font-bold text-primary mb-2">{price}</h3>
        <p className="text-muted-foreground flex items-center mb-4 text-sm">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </p>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          {specificities.map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <span key={index} className="flex items-center font-medium">
                <IconComponent className="h-4 w-4 mr-1 text-primary" />
                <span className="text-primary">{spec.value}</span>
              </span>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button className="w-full">Voir les détails</Button>
      </CardFooter>
    </Card>
  );
}

export { LandPropertyCard };