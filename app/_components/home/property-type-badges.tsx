  // | "land"
  // | "parking"
  // | "boat"
  // | "home"
  // | "villa"
  // | "apartment"
  // | "hotel"
  // | "office"
  // | "other";


import { Badge } from "@/components/ui/badge"
import { Home, Building2, TreePine, Car, Anchor } from 'lucide-react';

type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "PARKING" | "BOAT";

interface PropertyTypeBadge {
  type: PropertyType;
  label: string;
  icon: React.ElementType;
}

interface PropertyTypeBadgesProps {
  selectedTypes: PropertyType[];
  onToggle: (type: PropertyType) => void;
  mode: 'buy' | 'rent';
}

export function PropertyTypeBadges({ selectedTypes, onToggle, mode }: PropertyTypeBadgesProps) {
  const propertyTypes: PropertyTypeBadge[] = mode === 'buy'
    ? [
        { type: "RESIDENTIAL", label: "Residential", icon: Home },
        { type: "COMMERCIAL", label: "Commercial", icon: Building2 },
        { type: "LAND", label: "Land", icon: TreePine },
        { type: "PARKING", label: "Parking", icon: Car },
        { type: "BOAT", label: "Boat", icon: Anchor },
      ]
    : [
        { type: "RESIDENTIAL", label: "Residential", icon: Home },
        { type: "COMMERCIAL", label: "Commercial", icon: Building2 },
        { type: "PARKING", label: "Parking", icon: Car },
      ];

  return (
    <div className="flex flex-wrap gap-2">
      {propertyTypes.map(({ type, label, icon: Icon }) => (
        <Badge
          key={type}
          variant={selectedTypes.includes(type) ? "default" : "outline"}
          className="cursor-pointer transition-colors hover:bg-primary/80 py-2 px-4 rounded-full"
          onClick={() => onToggle(type)}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Badge>
      ))}
    </div>
  );
}

