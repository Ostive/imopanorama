"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyTypeBadges } from "./property-type-badges";
import { AdvancedFilterDrawer } from "./advanced-filter-drawer";

import {
  Search,
  ListFilter,
  Home,
  Building,
  DollarSign,
  MapPin,
  Coins,
  Maximize,
} from "lucide-react";

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

export function PropertySearch() {
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [surfaceRange, setSurfaceRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const handleTogglePropertyType = (type: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="max-w-4xl mx-auto -mt-32 relative z-20 bg-white rounded-lg shadow-lg p-6">
      <Tabs
        defaultValue="buy"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-200 rounded-lg h-14">
          <TabsTrigger
            value="buy"
            className="text-lg font-semibold flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="rent"
            className="text-lg font-semibold flex items-center justify-center"
          >
            <Building className="w-5 h-5 mr-2" />
            Rent
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="text-lg font-semibold flex items-center justify-center"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Sell
          </TabsTrigger>
        </TabsList>
        <div className="h-auto max-h-[450px] overflow-y-auto">
          <TabsContent value="buy">
            <BuyRentForm
              type="buy"
              selectedTypes={selectedTypes}
              onTogglePropertyType={handleTogglePropertyType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              surfaceRange={surfaceRange}
              setSurfaceRange={setSurfaceRange}
            />
          </TabsContent>
          <TabsContent value="rent">
            <BuyRentForm
              type="rent"
              selectedTypes={selectedTypes}
              onTogglePropertyType={handleTogglePropertyType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              surfaceRange={surfaceRange}
              setSurfaceRange={setSurfaceRange}
            />
          </TabsContent>
          <TabsContent value="sell">
            <SellForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

interface BuyRentFormProps {
  type: "buy" | "rent";
  selectedTypes: PropertyType[];
  onTogglePropertyType: (type: PropertyType) => void;
  priceRange: [number | null, number | null];
  setPriceRange: (value: [number | null, number | null]) => void;
  surfaceRange: [number | null, number | null];
  setSurfaceRange: (value: [number | null, number | null]) => void;
}

function BuyRentForm({
  type,
  selectedTypes,
  onTogglePropertyType,
  priceRange,
  setPriceRange,
  surfaceRange,
  setSurfaceRange,
}: BuyRentFormProps) {
  const [totalProperties, setTotalProperties] = useState(1234); // This would be fetched from an API in a real application

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label
            htmlFor={`${type}-location`}
            className="text-base font-semibold mb-1 block"
          >
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id={`${type}-location`}
              placeholder="Enter city, neighborhood, or address"
              className="pl-10 py-2 text-sm focus-visible:ring-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor={`${type}-max-price`}
              className="text-base font-semibold mb-1 block"
            >
              {type === "rent" ? "Max Rent" : "Max Price"}
            </Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id={`${type}-max-price`}
                placeholder={type === "rent" ? "Max monthly rent" : "Max price"}
                type="number"
                value={priceRange[1] ?? ""}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    e.target.value ? Number(e.target.value) : null,
                  ])
                }
                className="pl-10 py-2 text-sm focus-visible:ring-transparent"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor={`${type}-max-area`}
              className="text-base font-semibold mb-1 block"
            >
              Max Area
            </Label>
            <div className="relative">
              <Maximize className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id={`${type}-max-area`}
                placeholder="Max area (sq ft)"
                type="number"
                value={surfaceRange[1] ?? ""}
                onChange={(e) =>
                  setSurfaceRange([
                    surfaceRange[0],
                    e.target.value ? Number(e.target.value) : null,
                  ])
                }
                className="pl-10 py-2 text-sm focus-visible:ring-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      <PropertyTypeBadges
        selectedTypes={selectedTypes}
        onToggle={onTogglePropertyType}
      />
      <div className="mt-6 flex justify-between items-center">
        <div className="w-1/4"></div>
        <Button className="w-1/2 rounded-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base py-5">
          <Search className="h-5 w-5" />
          Search
        </Button>
        <div className="w-1/4 flex justify-end">
          <AdvancedFilterDrawer
            surfaceRange={surfaceRange}
            setSurfaceRange={setSurfaceRange}
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 hover:text-foreground hover:bg-gray-200 transition rounded-lg mr-5 text-sm"
            >
              <ListFilter className="h-5 w-5" />
              <span className="font-semibold hidden md:inline">
                More Filters
              </span>
            </Button>
          </AdvancedFilterDrawer>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total properties to {type}:{" "}
          <span className="font-semibold">{totalProperties}</span>
        </p>
      </div>
    </div>
  );
}

function SellForm() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label
          htmlFor="sell-location"
          className="text-base font-semibold mb-1 block"
        >
          Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="sell-location"
            placeholder="Enter full property address"
            className="pl-10 py-2 text-sm focus-visible:ring-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <Button className="w-2/3 rounded-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base py-5">
          <Search className="h-5 w-5" />
          Get Free Estimate
        </Button>
        <p className="text-sm text-gray-600 text-center mt-2">
          Receive an estimated value for your property within 24 hours.
        </p>
      </div>
    </div>
  );
}

