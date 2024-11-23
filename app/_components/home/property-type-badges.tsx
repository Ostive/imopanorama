"use client";

import { Badge } from "@/components/ui/badge";

type PropertyType =
  | "land"
  | "parking"
  | "boat"
  | "home"
  | "villa"
  | "apartment"
  | "hotel"
  | "office"
  | "other";

interface PropertyTypeBadgesProps {
  selectedTypes: PropertyType[];
  onToggle: (type: PropertyType) => void;
}

export function PropertyTypeBadges({
  selectedTypes,
  onToggle,
}: PropertyTypeBadgesProps) {
  const propertyTypes: { type: PropertyType; label: string }[] = [
    { type: "land", label: "Land" },
    { type: "parking", label: "Parking/Box" },
    { type: "boat", label: "Boat" },
    { type: "home", label: "Home" },
    { type: "villa", label: "Villa" },
    { type: "apartment", label: "Apartment" },
    { type: "hotel", label: "Hotel" },
    { type: "office", label: "Office" },
    { type: "other", label: "Other" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {propertyTypes.map(({ type, label }) => (
        <Badge
          key={type}
          variant={selectedTypes.includes(type) ? "default" : "outline"}
          className="cursor-pointer transition-colors hover:bg-primary/80"
          onClick={() => onToggle(type)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}
