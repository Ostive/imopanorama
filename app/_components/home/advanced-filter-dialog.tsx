"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  IconHome,
  IconBuilding,
  IconTrees,
  IconSailboat,
  IconCheck,
  IconClipboardList,
  IconUserCircle,
  IconStarFilled,
  IconHome2,
  IconBuildingSkyscraper,
  IconBuildingCottage,
  IconBuildingStore,
  IconBuildingHospital,
  IconBed,
  IconSwimming,
  IconParking,
  IconOffice,
  IconShoppingCart,
  IconHotel,
  IconBuildingWarehouse,
  IconMoon,
  IconSun,
  IconCalendarTime,
  IconSofa,
  IconArmchair,
  IconWashMachine,
  IconAirConditioning,
  IconFlame,
  IconPaw,
  IconSmokingNo,
  IconWifi,
  IconLifebuoy,
  IconUsers,
  IconBolt,
  IconRoad,
  IconWater,
  IconGasStation,
  IconTree,
  IconCar,
  IconBuildingBridge2,
  IconBuildingCommunity,
  IconMountain,
  IconWaves,
  IconPlug,
  IconDroplet,
  IconRecycle,
  IconPropeller,
  IconEngine,
  IconSteeringWheel,
  IconWindmill,
  IconBattery,
  IconUserPlus,
  IconAnchor,
  IconCompass,
  IconSunDeck,
  IconRefrigerator,
  IconMicrowave,
  IconWashDry1,
  IconShower,
  IconBath,
  IconShirt,
  IconHanger,
  IconRouter,
  IconAlertTriangle,
  IconFirstAidKit,
  IconCamera,
} from '@tabler/icons-react';

type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "BOAT";

interface AdvancedFilterDialogProps {
  children: React.ReactNode;
  mode: 'buy' | 'rent';
  selectedTypes: PropertyType[];
  onTogglePropertyType: (type: PropertyType) => void;
}

interface ToggleableBadgeProps {
  label: string;
  value: boolean;
  onToggle: () => void;
  icon: React.ElementType;
}

const ToggleableBadge: React.FC<ToggleableBadgeProps> = ({ label, value, onToggle, icon: Icon }) => (
  <Badge
    variant={value ? "default" : "outline"}
    className={`py-2 px-4 rounded-full cursor-pointer transition-colors ${
      value ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
    }`}
    onClick={onToggle}
  >
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </Badge>
);

export function AdvancedFilterDialog({ children, mode, selectedTypes, onTogglePropertyType }: AdvancedFilterDialogProps) {
  interface Filters {
    general: {
      status: string[];
      ownership: string[];
      condition: string[];
      rentalTerms: string[];
      furnished: string[];
    };
    propertySpecific: {
      RESIDENTIAL: {
        types: string[];
        amenities: {
          access: string[];
          outdoor: string[];
          parking: string[];
          kitchen: string[];
          bathroom: string[];
          bedroom: string[];
          internetAndOffice: string[];
          security: string[];
        };
        heatingAndCooling: string[];
      };
      COMMERCIAL: {
        types: string[];
        specificFilters: {
          hotel: {
            ROOMS_COUNT: number;
            SUITES_COUNT: number;
            RESTAURANT_INCLUDED: boolean;
          };
        };
        amenities: {
          access: string[];
          parking: string[];
          internet: string[];
        };
      };
      LAND: {
        zoning: string[];
        topography: string[];
        utilities: string[];
      };
      BOAT: {
        types: string[];
        engineTypes: string[];
        capacity: {
          PASSENGERS: number;
          CREW: number;
        };
        amenities: string[];
        rules: string[];
        rentalAmenities: string[];
      };
    };
    price: { min: number; max: number };
  }
  

  const [filters, setFilters] = useState<Filters>({
    general: {
      status: [],
      ownership: [],
      condition: [],
      rentalTerms: [],
      furnished: [],
    },
    propertySpecific: {
      RESIDENTIAL: {
        types: [],
        amenities: {
          access: [],
          outdoor: [],
          parking: [],
          kitchen: [],
          bathroom: [],
          bedroom: [],
          internetAndOffice: [],
          security: [],
        },
        heatingAndCooling: [],
      },
      COMMERCIAL: {
        types: [],
        specificFilters: {
          hotel: {
            ROOMS_COUNT: 0,
            SUITES_COUNT: 0,
            RESTAURANT_INCLUDED: false,
          },
        },
        amenities: {
          access: [],
          parking: [],
          internet: [],
        },
      },
      LAND: {
        zoning: [],
        topography: [],
        utilities: [],
      },
      BOAT: {
        types: [],
        engineTypes: [],
        capacity: {
          PASSENGERS: 0,
          CREW: 0,
        },
        amenities: [],
        rules: [],
        rentalAmenities: [],
      },
    },
    price: { min: 0, max: 0 },
  });

  type AmenityCategory = 'access' | 'outdoor' | 'parking' | 'kitchen' | 'bathroom' | 'bedroom' | 'internetAndOffice' | 'security';
  
  const handleFilterChange = (category: keyof Filters, subCategory: keyof Filters['general'] | keyof Filters['propertySpecific'][PropertyType] | AmenityCategory | null, field: string, value: unknown) => {
    setFilters((prev: Filters) => {
      if (subCategory) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [subCategory]: {
              ...(prev[category] as any)[subCategory],
              [field]: value,
            },
          },
        };
      } else {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: value,
          },
        };
      }
    });
  const toggleOption = (category: keyof Filters, subCategory: keyof Filters['general'] | keyof Filters['propertySpecific'][PropertyType] | AmenityCategory | null, field: string, option: string) => {

  const toggleOption = (category: keyof Filters, subCategory: keyof Filters['general'] | keyof Filters['propertySpecific'][PropertyType] | null, field: string, option: string) => {
    setFilters((prev: Filters) => {
      const currentOptions: string[] = subCategory
        ? (prev[category] as any)[subCategory][field] as string[]
        : (prev[category] as any)[field] as string[];
      const updatedOptions = currentOptions.includes(option)
        ? currentOptions.filter((item: string) => item !== option)
        : [...currentOptions, option];

      if (subCategory) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [subCategory]: {
              ...(prev[category] as Filters['general'])[subCategory as keyof Filters['general']],
              [field]: updatedOptions,
            },
          },
        };
      } else {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: updatedOptions,
          },
        };
      }
    });
  };

  const filterData = {
    sale: {
      general: {
        status: [
          { type: "AVAILABLE", label: "Available", icon: IconCheck },
          { type: "UNDER_CONTRACT", label: "Under Contract", icon: IconClipboardList },
          { type: "SOLD", label: "Sold", icon: IconUserCircle }
        ],
        ownership: [
          { type: "AGENCY", label: "Agency", icon: IconBuilding },
          { type: "PRIVATE", label: "Private", icon: IconUserCircle }
        ],
        condition: [
          { type: "NEW", label: "New", icon: IconStarFilled },
          { type: "EXCELLENT", label: "Excellent", icon: IconStarFilled },
          { type: "GOOD", label: "Good", icon: IconStarFilled },
          { type: "FAIR", label: "Fair", icon: IconStarFilled },
          { type: "NEEDS_WORK", label: "Needs Work", icon: IconStarFilled }
        ]
      },
      propertySpecific: {
        RESIDENTIAL: {
          types: [
            { type: "HOUSE", label: "House", icon: IconHome2 },
            { type: "VILLA", label: "Villa", icon: IconBuildingSkyscraper },
            { type: "APARTMENT", label: "Apartment", icon: IconBuildingSkyscraper },
            { type: "CONDO", label: "Condo", icon: IconBuildingSkyscraper }
          ],
          amenities: {
            access: [
              { type: "Electricity", label: "Electricity", icon: IconBolt },
              { type: "Road Access", label: "Road Access", icon: IconRoad },
              { type: "Water Supply", label: "Water Supply", icon: IconWater },
              { type: "Gas Connection", label: "Gas Connection", icon: IconGasStation }
            ],
            outdoor: [
              { type: "Garden", label: "Garden", icon: IconTree },
              { type: "Swimming Pool", label: "Swimming Pool", icon: IconSwimming },
              { type: "Terrace", label: "Terrace", icon: IconSunDeck }
            ],
            parking: [
              { type: "Garage", label: "Garage", icon: IconParking },
              { type: "Driveway", label: "Driveway", icon: IconParking },
              { type: "Street Parking", label: "Street Parking", icon: IconCar }
            ]
          }
        },
        COMMERCIAL: {
          types: [
            { type: "OFFICE", label: "Office", icon: IconOffice },
            { type: "RETAIL", label: "Retail", icon: IconShoppingCart },
            { type: "HOTEL", label: "Hotel", icon: IconHotel },
            { type: "BUNGALOW", label: "Bungalow", icon: IconBuildingCottage }
          ],
          specificFilters: {
            hotel: [
              { type: "ROOMS_COUNT", label: "Number of Rooms", icon: IconBed },
              { type: "SUITES_COUNT", label: "Number of Suites", icon: IconBed },
              { type: "RESTAURANT_INCLUDED", label: "Has Restaurant", icon: IconShoppingCart }
            ]
          },
          amenities: {
            access: [
              { type: "Electricity", label: "Electricity", icon: IconBolt },
              { type: "Road Access", label: "Road Access", icon: IconRoad },
              { type: "Internet Connectivity", label: "Internet Connectivity", icon: IconWifi }
            ],
            parking: [
              { type: "Underground", label: "Underground", icon: IconBuildingBridge2 },
              { type: "Street Parking", label: "Street Parking", icon: IconParking },
              { type: "Private Lot", label: "Private Lot", icon: IconBuildingCommunity }
            ]
          }
        },
        LAND: {
          zoning: [
            { type: "RESIDENTIAL", label: "Residential Zoning", icon: IconHome },
            { type: "COMMERCIAL", label: "Commercial Zoning", icon: IconBuilding },
            { type: "AGRICULTURAL", label: "Agricultural Zoning", icon: IconTrees }
          ],
          topography: [
            { type: "Flat", label: "Flat", icon: IconRoad },
            { type: "Hilly", label: "Hilly", icon: IconMountain },
            { type: "Waterfront", label: "Waterfront", icon: IconWaves }
          ],
          utilities: [
            { type: "Electricity", label: "Electricity", icon: IconBolt },
            { type: "Water", label: "Water", icon: IconDroplet },
            { type: "Sewage", label: "Sewage", icon: IconRecycle },
            { type: "Gas", label: "Gas", icon: IconGasStation }
          ]
        },
        BOAT: {
          types: [
            { type: "SAILBOAT", label: "Sailboat", icon: IconSailboat },
            { type: "MOTORBOAT", label: "Motorboat", icon: IconPropeller },
            { type: "YACHT", label: "Yacht", icon: IconAnchor },
            { type: "HOUSEBOAT", label: "Houseboat", icon: IconHome2 },
            { type: "CATAMARAN", label: "Catamaran", icon: IconSailboat }
          ],
          engineTypes: [
            { type: "OUTBOARD", label: "Outboard", icon: IconEngine },
            { type: "INBOARD", label: "Inboard", icon: IconEngine },
            { type: "STERN_DRIVE", label: "Stern Drive", icon: IconSteeringWheel },
            { type: "JET_DRIVE", label: "Jet Drive", icon: IconWindmill },
            { type: "ELECTRIC", label: "Electric", icon: IconBattery }
          ],
          capacity: [
            { type: "PASSENGERS", label: "Passenger Capacity", icon: IconUsers },
            { type: "CREW", label: "Crew Capacity", icon: IconUserPlus }
          ],
          amenities: [
            { type: "AIR_CONDITIONING", label: "Air Conditioning", icon: IconAirConditioning },
            { type: "NAVIGATION_SYSTEM", label: "Navigation System", icon: IconCompass },
            { type: "LIFE_JACKETS", label: "Life Jackets Included", icon: IconLifebuoy },
            { type: "SUNDECK", label: "Sundeck", icon: IconSunDeck }
          ]
        }
      }
    },
    rent: {
      general: {
        rentalTerms: [
          { type: "SHORT_TERM", label: "Short Term", icon: IconMoon },
          { type: "LONG_TERM", label: "Long Term", icon: IconSun },
          { type: "MONTHLY", label: "Monthly", icon: IconCalendarTime }
        ],
        furnished: [
          { type: "FULLY_FURNISHED", label: "Fully Furnished", icon: IconSofa },
          { type: "PARTIALLY_FURNISHED", label: "Partially Furnished", icon: IconArmchair },
          { type: "UNFURNISHED", label: "Unfurnished", icon: IconHome }
        ]
      },
      propertySpecific: {
        RESIDENTIAL: {
          types: [
            { type: "APARTMENT", label: "Apartment", icon: IconBuildingSkyscraper },
            { type: "HOUSE", label: "House", icon: IconHome2 },
            { type: "VILLA", label: "Villa", icon: IconBuildingSkyscraper }
          ],
          amenities: {
            kitchen: [
              { type: "Refrigerator", label: "Refrigerator", icon: IconRefrigerator },
              { type: "Microwave", label: "Microwave", icon: IconMicrowave },
              { type: "Dishwasher", label: "Dishwasher", icon: IconWashDry1 }
            ],
            bathroom: [
              { type: "Shower", label: "Shower", icon: IconShower },
              { type:
"Bathtub", label: "Bathtub", icon: IconBath },
              { type: "Towels Included", label: "Towels Included", icon: IconShirt }
            ],
            bedroom: [
              { type: "Closet", label: "Closet", icon: IconHanger },
              { type: "Bed Linens", label: "Bed Linens", icon: IconBed },
              { type: "Laundry Equipment", label: "Laundry Equipment", icon: IconWashMachine }
            ],
            internetAndOffice: [
              { type: "Fiber Internet", label: "Fiber Internet", icon: IconWifi },
              { type: "DSL", label: "DSL", icon: IconRouter },
              { type: "Wifi", label: "Wifi", icon: IconWifi }
            ],
            security: [
              { type: "Smoke Detector", label: "Smoke Detector", icon: IconAlertTriangle },
              { type: "First Aid Kit", label: "First Aid Kit", icon: IconFirstAidKit },
              { type: "Security Cameras", label: "Security Cameras", icon: IconCamera }
            ]
          },
          heatingAndCooling: [
            { type: "AIR_CONDITIONING", label: "Air Conditioning", icon: IconAirConditioning },
            { type: "CENTRAL", label: "Central Heating", icon: IconFlame }
          ]
        },
        COMMERCIAL: {
          types: [
            { type: "OFFICE", label: "Office", icon: IconOffice },
            { type: "RETAIL", label: "Retail Space", icon: IconShoppingCart }
          ],
          amenities: {
            parking: [
              { type: "Underground", label: "Underground", icon: IconBuildingBridge2 },
              { type: "Outdoor Lot", label: "Outdoor Lot", icon: IconParking }
            ],
            internet: [
              { type: "Fiber", label: "Fiber", icon: IconWifi },
              { type: "DSL", label: "DSL", icon: IconRouter }
            ]
          }
        },
        BOAT: {
          types: [
            { type: "SAILBOAT", label: "Sailboat", icon: IconSailboat },
            { type: "MOTORBOAT", label: "Motorboat", icon: IconPropeller },
            { type: "YACHT", label: "Yacht", icon: IconAnchor },
            { type: "HOUSEBOAT", label: "Houseboat", icon: IconHome2 },
            { type: "CATAMARAN", label: "Catamaran", icon: IconSailboat }
          ],
          rules: [
            { type: "PETS_ALLOWED", label: "Pets Allowed", icon: IconPaw },
            { type: "NO_SMOKING", label: "No Smoking", icon: IconSmokingNo }
          ],
          rentalAmenities: [
            { type: "WIFI", label: "Wifi", icon: IconWifi },
            { type: "TOWELS", label: "Towels Included", icon: IconShirt },
            { type: "LIFE_JACKETS", label: "Life Jackets Provided", icon: IconLifebuoy }
          ],
          capacity: [
            { type: "PASSENGERS", label: "Passenger Capacity", icon: IconUsers }
          ]
        }
      }
    }
  };

  const propertyTypes: { type: PropertyType; label: string; icon: React.ElementType }[] = [
    { type: "RESIDENTIAL", label: "Residential", icon: IconHome },
    { type: "COMMERCIAL", label: "Commercial", icon: IconBuilding },
    { type: "LAND", label: "Land", icon: IconTrees },
    { type: "BOAT", label: "Boat", icon: IconSailboat },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Refine your property search with detailed filters.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 pb-6">
          <div className="space-y-8">
            <div>
              <Label className="font-bold mb-2 block">Property Type</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map(({ type, label, icon }) => (
                  <ToggleableBadge
                    key={type}
                    label={label}
                    value={selectedTypes.includes(type)}
                    onToggle={() => onTogglePropertyType(type)}
                    icon={icon}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* General Filters */}
            <div className="space-y-6">
              <Label className="font-bold mb-2 block">General Filters</Label>
              {mode === 'buy' && (
                <>
                  <div>
                    <Label className="mb-2 block">Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.sale.general.status.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.general.status.includes(type)}
                          onToggle={() => toggleOption('general', null, 'status', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Ownership</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.sale.general.ownership.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.general.ownership.includes(type)}
                          onToggle={() => toggleOption('general', null, 'ownership', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Condition</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.sale.general.condition.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.general.condition.includes(type)}
                          onToggle={() => toggleOption('general', null, 'condition', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              {mode === 'rent' && (
                <>
                  <div>
                    <Label className="mb-2 block">Rental Terms</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.rent.general.rentalTerms.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.general.rentalTerms.includes(type)}
                          onToggle={() => toggleOption('general', null, 'rentalTerms', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Furnished</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.rent.general.furnished.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.general.furnished.includes(type)}
                          onToggle={() => toggleOption('general', null, 'furnished', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Property Specific Filters */}
            {selectedTypes.includes("RESIDENTIAL") && (
              <div className="space-y-6">
                <Label className="font-bold mb-2 block">Residential Filters</Label>
                <div>
                  <Label className="mb-2 block">Property Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {(mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.RESIDENTIAL.types.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.RESIDENTIAL.types.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'RESIDENTIAL', 'types', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Amenities</Label>
                  {Object.entries((mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.RESIDENTIAL.amenities).map(([category, amenities]) => (
                    <div key={category} className="mb-4">
                      <Label className="mb-2 block capitalize">{category}</Label>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map(({ type, label, icon }) => (
                          <ToggleableBadge
                            value={filters.propertySpecific.RESIDENTIAL.amenities[category as AmenityCategory].includes(type)}
                            onToggle={() => toggleOption('propertySpecific', 'RESIDENTIAL', `amenities.${category as AmenityCategory}`, type)}
                            value={filters.propertySpecific.RESIDENTIAL.amenities[category].includes(type)}
                            onToggle={() => toggleOption('propertySpecific', 'RESIDENTIAL', `amenities.${category}`, type)}
                            icon={icon}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {mode === 'rent' && (
                  <div>
                    <Label className="mb-2 block">Heating and Cooling</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.rent.propertySpecific.RESIDENTIAL.heatingAndCooling.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.propertySpecific.RESIDENTIAL.heatingAndCooling.includes(type)}
                          onToggle={() => toggleOption('propertySpecific', 'RESIDENTIAL', 'heatingAndCooling', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTypes.includes("COMMERCIAL") && (
              <div className="space-y-6">
                <Label className="font-bold mb-2 block">Commercial Filters</Label>
                <div>
                  <Label className="mb-2 block">Property Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {(mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.COMMERCIAL.types.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.COMMERCIAL.types.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'COMMERCIAL', 'types', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                {mode === 'buy' && filters.propertySpecific.COMMERCIAL.types.includes('HOTEL') && (
                  <div>
                    <Label className="mb-2 block">Hotel Specific Filters</Label>
                    <div className="space-y-2">
                      {filterData.sale.propertySpecific.COMMERCIAL.specificFilters.hotel.map(({ type, label, icon }) => (
                        <div key={type} className="flex items-center space-x-2">
                          {type === 'RESTAURANT_INCLUDED' ? (
                            <Checkbox
                              id={type}
                              checked={filters.propertySpecific.COMMERCIAL.specificFilters.hotel[type]}
                              onCheckedChange={(checked) => handleFilterChange('propertySpecific', 'COMMERCIAL', `specificFilters.hotel.${type}`, checked)}
                            />
                          ) : (
                            <Input
                              id={type}
                              type="number"
                              value={filters.propertySpecific.COMMERCIAL.specificFilters.hotel[type]}
                              onChange={(e) => handleFilterChange('propertySpecific', 'COMMERCIAL', `specificFilters.hotel.${type}`, parseInt(e.target.value))}
                              className="w-20"
                            />
                          )}
                          <Label htmlFor={type} className="flex items-center">
                            {React.createElement(icon, { className: "w-5 h-5 mr-2" })}
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Amenities</Label>
                  {Object.entries((mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.COMMERCIAL.amenities).map(([category, amenities]) => (
                    <div key={category} className="mb-4">
                      <Label className="mb-2 block capitalize">{category}</Label>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map(({ type, label, icon }) => (
                          <ToggleableBadge
                            key={type}
                            label={label}
                            value={filters.propertySpecific.COMMERCIAL.amenities[category].includes(type)}
                            onToggle={() => toggleOption('propertySpecific', 'COMMERCIAL', `amenities.${category}`, type)}
                            icon={icon}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTypes.includes("LAND") && mode === 'buy' && (
              <div className="space-y-6">
                <Label className="font-bold mb-2 block">Land Filters</Label>
                <div>
                  <Label className="mb-2 block">Zoning</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterData.sale.propertySpecific.LAND.zoning.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.LAND.zoning.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'LAND', 'zoning', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Topography</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterData.sale.propertySpecific.LAND.topography.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.LAND.topography.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'LAND', 'topography', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Utilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterData.sale.propertySpecific.LAND.utilities.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.LAND.utilities.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'LAND', 'utilities', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTypes.includes("BOAT") && (
              <div className="space-y-6">
                <Label className="font-bold mb-2 block">Boat Filters</Label>
                <div>
                  <Label className="mb-2 block">Boat Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {(mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.BOAT.types.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.BOAT.types.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'BOAT', 'types', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                {mode === 'buy' && (
                  <div>
                    <Label className="mb-2 block">Engine Types</Label>
                    <div className="flex flex-wrap gap-2">
                      {filterData.sale.propertySpecific.BOAT.engineTypes.map(({ type, label, icon }) => (
                        <ToggleableBadge
                          key={type}
                          label={label}
                          value={filters.propertySpecific.BOAT.engineTypes.includes(type)}
                          onToggle={() => toggleOption('propertySpecific', 'BOAT', 'engineTypes', type)}
                          icon={icon}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {(mode === 'buy' ? filterData.sale : filterData.rent).propertySpecific.BOAT.amenities.map(({ type, label, icon }) => (
                      <ToggleableBadge
                        key={type}
                        label={label}
                        value={filters.propertySpecific.BOAT.amenities.includes(type)}
                        onToggle={() => toggleOption('propertySpecific', 'BOAT', 'amenities', type)}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
                {mode === 'rent' && (
                  <>
                    <div>
                      <Label className="mb-2 block">Rules</Label>
                      <div className="flex flex-wrap gap-2">
                        {filterData.rent.propertySpecific.BOAT.rules.map(({ type, label, icon }) => (
                          <ToggleableBadge
                            key={type}
                            label={label}
                            value={filters.propertySpecific.BOAT.rules.includes(type)}
                            onToggle={() => toggleOption('propertySpecific', 'BOAT', 'rules', type)}
                            icon={icon}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Rental Amenities</Label>
                      <div className="flex flex-wrap gap-2">
                        {filterData.rent.propertySpecific.BOAT.rentalAmenities.map(({ type, label, icon }) => (
                          <ToggleableBadge
                            key={type}
                            label={label}
                            value={filters.propertySpecific.BOAT.rentalAmenities.includes(type)}
                            onToggle={() => toggleOption('propertySpecific', 'BOAT', 'rentalAmenities', type)}
                            icon={icon}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
              <Label className="font-bold mb-2 flex items-center">
                Price Range
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.price.min}
                  onChange={(e) => handleFilterChange('price', null, 'min', parseInt(e.target.value) || 0)}
                  className="focus-visible:ring-transparent"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.price.max}
                  onChange={(e) => handleFilterChange('price', null, 'max', parseInt(e.target.value) || 0)}
                  className="focus-visible:ring-transparent"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-2">
          <Button type="submit" className="w-full focus-visible:ring-transparent">Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

