"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconHome,
  IconBuilding,
  IconCar,
  IconAnchor,
  IconTrees,
  IconCurrencyDollar,
  IconFlag,
  IconUser,
  IconBed,
  IconBath,
  IconRuler,
  IconCalendar,
  IconLayersIntersect,
  IconThermometer,
  IconShield,
  IconWifi,
  IconPool,
} from "@tabler/icons-react";

interface AdvancedFilterDrawerProps {
  children: React.ReactNode;
}

interface ToggleableBadgeProps {
  label: string;
  value: boolean;
  onToggle: () => void;
  icon: React.ElementType;
}

const ToggleableBadge: React.FC<ToggleableBadgeProps> = ({
  label,
  value,
  onToggle,
  icon: Icon,
}) => (
  <Badge
    variant={value ? "default" : "outline"}
    className={`py-2 px-4 rounded-full cursor-pointer transition-colors ${
      value
        ? "bg-primary text-primary-foreground"
        : "bg-background text-foreground"
    }`}
    onClick={onToggle}
  >
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </Badge>
);

export function AdvancedFilterDrawer({ children }: AdvancedFilterDrawerProps) {
  const [filters, setFilters] = useState({
    propertyType: "",
    price: { min: 0, max: 1000000 },
    status: "",
    ownershipType: "",
    residential: {
      bedrooms: 0,
      bathrooms: 0,
      livingSpace: 0,
      builtYear: null,
      floors: null,
      heatingType: null,
      insulationType: null,
      roofType: null,
      equippedKitchen: false,
      garage: false,
      garden: "",
      pool: null,
      condition: null,
      internetConnectivity: null,
      securityAlarm: false,
      hoaFees: null,
    },
    commercial: {
      totalArea: 0,
      usage: "",
      parkingSpaces: 0,
      yearBuilt: null,
      energyRating: "",
    },
    land: {
      totalArea: 0,
      zoning: "",
      utilities: [],
      topography: "",
    },
    parking: {
      type: "",
      spaces: 0,
      security: "",
      coveredSpaces: 0,
    },
    boat: {
      type: "",
      length: 0,
      berths: 0,
      yearBuilt: null,
      engineType: "",
    },
  });

  const handleFilterChange = (category: string, field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const propertyTypes = [
    { type: "RESIDENTIAL", icon: IconHome },
    { type: "COMMERCIAL", icon: IconBuilding },
    { type: "LAND", icon: IconTrees },
    { type: "PARKING", icon: IconCar },
    { type: "BOAT", icon: IconAnchor },
  ];

  const statusOptions = [
    "AVAILABLE",
    "UNDER_CONTRACT",
    "SOLD",
    "PENDING",
    "NOT_AVAILABLE",
  ];
  const ownershipTypes = ["AGENCY", "PRIVATE"];

  const heatingTypes = ["CENTRAL", "ELECTRIC", "WOOD"];
  const insulationTypes = ["DOUBLE_GLAZING", "TRIPLE_GLAZING", "NONE"];
  const roofTypes = ["TILES", "METAL", "SLATE"];
  const poolTypes = ["INDOOR", "OUTDOOR", "NONE"];
  const conditionTypes = ["NEW", "EXCELLENT", "GOOD", "FAIR", "NEEDS_WORK"];
  const internetTypes = ["FIBER", "CABLE", "DSL", "SATELLITE", "NONE"];
  const commercialUsageTypes = ["OFFICE", "RETAIL", "INDUSTRIAL", "MIXED_USE"];
  const landZoningTypes = [
    "RESIDENTIAL",
    "COMMERCIAL",
    "INDUSTRIAL",
    "AGRICULTURAL",
    "MIXED_USE",
  ];
  const landUtilitiesTypes = [
    "ELECTRICITY",
    "WATER",
    "SEWAGE",
    "GAS",
    "INTERNET",
  ];
  const landTopographyTypes = ["FLAT", "SLOPED", "HILLY", "WATERFRONT"];
  const parkingTypes = ["INDOOR", "OUTDOOR", "STREET", "GARAGE"];
  const parkingSecurityTypes = ["GATED", "CCTV", "SECURITY_GUARD", "NONE"];
  const boatTypes = ["SAILBOAT", "MOTORBOAT", "YACHT", "HOUSEBOAT"];
  const boatEngineTypes = ["OUTBOARD", "INBOARD", "STERN_DRIVE", "JET_DRIVE"];

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Refine your property search with detailed filters.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div>
            <Label className="font-bold mb-2 block">Property Type</Label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(({ type, icon }) => (
                <ToggleableBadge
                  key={type}
                  label={type.charAt(0) + type.slice(1).toLowerCase()}
                  value={filters.propertyType === type}
                  onToggle={() =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyType: prev.propertyType === type ? "" : type,
                    }))
                  }
                  icon={icon}
                />
              ))}
            </div>
          </div>

          {filters.propertyType === "RESIDENTIAL" && (
            <div>
              <Label className="font-bold mb-2 block">
                Residential Details
              </Label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms" className="mb-1 block">
                      Bedrooms
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={filters.residential.bedrooms}
                      onChange={(e) =>
                        handleFilterChange(
                          "residential",
                          "bedrooms",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="focus-visible:ring-transparent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms" className="mb-1 block">
                      Bathrooms
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={filters.residential.bathrooms}
                      onChange={(e) =>
                        handleFilterChange(
                          "residential",
                          "bathrooms",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="focus-visible:ring-transparent"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="livingSpace" className="mb-1 block">
                    Living Space (m²)
                  </Label>
                  <Input
                    id="livingSpace"
                    type="number"
                    value={filters.residential.livingSpace}
                    onChange={(e) =>
                      handleFilterChange(
                        "residential",
                        "livingSpace",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="builtYear" className="mb-1 block">
                      Built Year
                    </Label>
                    <Input
                      id="builtYear"
                      type="number"
                      value={filters.residential.builtYear || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "residential",
                          "builtYear",
                          parseInt(e.target.value) || null
                        )
                      }
                      className="focus-visible:ring-transparent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floors" className="mb-1 block">
                      Floors
                    </Label>
                    <Input
                      id="floors"
                      type="number"
                      value={filters.residential.floors || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "residential",
                          "floors",
                          parseInt(e.target.value) || null
                        )
                      }
                      className="focus-visible:ring-transparent"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="heatingType" className="mb-1 block">
                    Heating Type
                  </Label>
                  <Select
                    value={filters.residential.heatingType || ""}
                    onValueChange={(value) =>
                      handleFilterChange("residential", "heatingType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heating type" />
                    </SelectTrigger>
                    <SelectContent>
                      {heatingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="insulationType" className="mb-1 block">
                    Insulation Type
                  </Label>
                  <Select
                    value={filters.residential.insulationType || ""}
                    onValueChange={(value) =>
                      handleFilterChange("residential", "insulationType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insulation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {insulationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roofType" className="mb-1 block">
                    Roof Type
                  </Label>
                  <Select
                    value={filters.residential.roofType || ""}
                    onValueChange={(value) =>
                      handleFilterChange("residential", "roofType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roofTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="equippedKitchen"
                    checked={filters.residential.equippedKitchen}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "residential",
                        "equippedKitchen",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="equippedKitchen">Equipped Kitchen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="garage"
                    checked={filters.residential.garage}
                    onCheckedChange={(checked) =>
                      handleFilterChange("residential", "garage", checked)
                    }
                  />
                  <Label htmlFor="garage">Garage</Label>
                </div>
                <div>
                  <Label htmlFor="garden" className="mb-1 block">
                    Garden
                  </Label>
                  <Input
                    id="garden"
                    value={filters.residential.garden}
                    onChange={(e) =>
                      handleFilterChange(
                        "residential",
                        "garden",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Surface 50 m²"
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="pool" className="mb-1 block">
                    Pool
                  </Label>
                  <Select
                    value={filters.residential.pool || ""}
                    onValueChange={(value) =>
                      handleFilterChange("residential", "pool", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pool type" />
                    </SelectTrigger>
                    <SelectContent>
                      {poolTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition" className="mb-1 block">
                    Condition
                  </Label>
                  <Select
                    value={filters.residential.condition || ""}
                    onValueChange={(value) =>
                      handleFilterChange("residential", "condition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="internetConnectivity" className="mb-1 block">
                    Internet Connectivity
                  </Label>
                  <Select
                    value={filters.residential.internetConnectivity || ""}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "residential",
                        "internetConnectivity",
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select internet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {internetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="securityAlarm"
                    checked={filters.residential.securityAlarm}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "residential",
                        "securityAlarm",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="securityAlarm">Security Alarm</Label>
                </div>
                <div>
                  <Label htmlFor="hoaFees" className="mb-1 block">
                    HOA Fees
                  </Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    value={filters.residential.hoaFees || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "residential",
                        "hoaFees",
                        parseFloat(e.target.value) || null
                      )
                    }
                    placeholder="Monthly HOA fees"
                    className="focus-visible:ring-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {filters.propertyType === "COMMERCIAL" && (
            <div>
              <Label className="font-bold mb-2 block">Commercial Details</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="commercialTotalArea" className="mb-1 block">
                    Total Area (m²)
                  </Label>
                  <Input
                    id="commercialTotalArea"
                    type="number"
                    value={filters.commercial.totalArea}
                    onChange={(e) =>
                      handleFilterChange(
                        "commercial",
                        "totalArea",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="commercialUsage" className="mb-1 block">
                    Usage
                  </Label>
                  <Select
                    value={filters.commercial.usage}
                    onValueChange={(value) =>
                      handleFilterChange("commercial", "usage", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {commercialUsageTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="commercialParkingSpaces"
                    className="mb-1 block"
                  >
                    Parking Spaces
                  </Label>
                  <Input
                    id="commercialParkingSpaces"
                    type="number"
                    value={filters.commercial.parkingSpaces}
                    onChange={(e) =>
                      handleFilterChange(
                        "commercial",
                        "parkingSpaces",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="commercialYearBuilt" className="mb-1 block">
                    Year Built
                  </Label>
                  <Input
                    id="commercialYearBuilt"
                    type="number"
                    value={filters.commercial.yearBuilt || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "commercial",
                        "yearBuilt",
                        parseInt(e.target.value) || null
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="commercialEnergyRating"
                    className="mb-1 block"
                  >
                    Energy Rating
                  </Label>
                  <Input
                    id="commercialEnergyRating"
                    value={filters.commercial.energyRating}
                    onChange={(e) =>
                      handleFilterChange(
                        "commercial",
                        "energyRating",
                        e.target.value
                      )
                    }
                    placeholder="e.g., A, B, C"
                    className="focus-visible:ring-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {filters.propertyType === "LAND" && (
            <div>
              <Label className="font-bold mb-2 block">Land Details</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="landTotalArea" className="mb-1 block">
                    Total Area (m²)
                  </Label>
                  <Input
                    id="landTotalArea"
                    type="number"
                    value={filters.land.totalArea}
                    onChange={(e) =>
                      handleFilterChange(
                        "land",
                        "totalArea",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="landZoning" className="mb-1 block">
                    Zoning
                  </Label>
                  <Select
                    value={filters.land.zoning}
                    onValueChange={(value) =>
                      handleFilterChange("land", "zoning", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zoning type" />
                    </SelectTrigger>
                    <SelectContent>
                      {landZoningTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Utilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {landUtilitiesTypes.map((utility) => (
                      <ToggleableBadge
                        key={utility}
                        label={
                          utility.charAt(0) + utility.slice(1).toLowerCase()
                        }
                        value={filters.land.utilities.includes(utility)}
                        onToggle={() => {
                          const updatedUtilities =
                            filters.land.utilities.includes(utility)
                              ? filters.land.utilities.filter(
                                  (u) => u !== utility
                                )
                              : [...filters.land.utilities, utility];
                          handleFilterChange(
                            "land",
                            "utilities",
                            updatedUtilities
                          );
                        }}
                        icon={IconShield}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="landTopography" className="mb-1 block">
                    Topography
                  </Label>
                  <Select
                    value={filters.land.topography}
                    onValueChange={(value) =>
                      handleFilterChange("land", "topography", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topography" />
                    </SelectTrigger>
                    <SelectContent>
                      {landTopographyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {filters.propertyType === "PARKING" && (
            <div>
              <Label className="font-bold mb-2 block">Parking Details</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parkingType" className="mb-1 block">
                    Parking Type
                  </Label>
                  <Select
                    value={filters.parking.type}
                    onValueChange={(value) =>
                      handleFilterChange("parking", "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {parkingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parkingSpaces" className="mb-1 block">
                    Total Spaces
                  </Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    value={filters.parking.spaces}
                    onChange={(e) =>
                      handleFilterChange(
                        "parking",
                        "spaces",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="parkingSecurity" className="mb-1 block">
                    Security
                  </Label>
                  <Select
                    value={filters.parking.security}
                    onValueChange={(value) =>
                      handleFilterChange("parking", "security", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                      {parkingSecurityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parkingCoveredSpaces" className="mb-1 block">
                    Covered Spaces
                  </Label>
                  <Input
                    id="parkingCoveredSpaces"
                    type="number"
                    value={filters.parking.coveredSpaces}
                    onChange={(e) =>
                      handleFilterChange(
                        "parking",
                        "coveredSpaces",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {filters.propertyType === "BOAT" && (
            <div>
              <Label className="font-bold mb-2 block">Boat Details</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="boatType" className="mb-1 block">
                    Boat Type
                  </Label>
                  <Select
                    value={filters.boat.type}
                    onValueChange={(value) =>
                      handleFilterChange("boat", "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select boat type" />
                    </SelectTrigger>
                    <SelectContent>
                      {boatTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="boatLength" className="mb-1 block">
                    Length (m)
                  </Label>
                  <Input
                    id="boatLength"
                    type="number"
                    value={filters.boat.length}
                    onChange={(e) =>
                      handleFilterChange(
                        "boat",
                        "length",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="boatBerths" className="mb-1 block">
                    Berths
                  </Label>
                  <Input
                    id="boatBerths"
                    type="number"
                    value={filters.boat.berths}
                    onChange={(e) =>
                      handleFilterChange(
                        "boat",
                        "berths",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="boatYearBuilt" className="mb-1 block">
                    Year Built
                  </Label>
                  <Input
                    id="boatYearBuilt"
                    type="number"
                    value={filters.boat.yearBuilt || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "boat",
                        "yearBuilt",
                        parseInt(e.target.value) || null
                      )
                    }
                    className="focus-visible:ring-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="boatEngineType" className="mb-1 block">
                    Engine Type
                  </Label>
                  <Select
                    value={filters.boat.engineType}
                    onValueChange={(value) =>
                      handleFilterChange("boat", "engineType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {boatEngineTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="font-bold mb-2 flex items-center">
              <IconCurrencyDollar className="w-6 h-6 mr-2" />
              Price Range
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.price.min}
                onChange={(e) =>
                  handleFilterChange(
                    "price",
                    "min",
                    parseInt(e.target.value) || 0
                  )
                }
                className="focus-visible:ring-transparent"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.price.max}
                onChange={(e) =>
                  handleFilterChange(
                    "price",
                    "max",
                    parseInt(e.target.value) || 0
                  )
                }
                className="focus-visible:ring-transparent"
              />
            </div>
          </div>

          <div>
            <Label className="font-bold mb-2 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <ToggleableBadge
                  key={status}
                  label={status.replace("_", " ")}
                  value={filters.status === status}
                  onToggle={() =>
                    setFilters((prev) => ({
                      ...prev,
                      status: prev.status === status ? "" : status,
                    }))
                  }
                  icon={IconFlag}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="font-bold mb-2 block">Ownership Type</Label>
            <div className="flex flex-wrap gap-2">
              {ownershipTypes.map((type) => (
                <ToggleableBadge
                  key={type}
                  label={type.charAt(0) + type.slice(1).toLowerCase()}
                  value={filters.ownershipType === type}
                  onToggle={() =>
                    setFilters((prev) => ({
                      ...prev,
                      ownershipType: prev.ownershipType === type ? "" : type,
                    }))
                  }
                  icon={IconUser}
                />
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              className="w-full focus-visible:ring-transparent"
            >
              Apply Filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
