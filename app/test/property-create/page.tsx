"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  MdClose,
  MdFileUpload,
  MdImage,
  MdStraighten,
  MdApartment,
  MdTerrain,
  MdWbSunny,
  MdLocationOn,
  MdWifi,
  MdWaterDrop,
  MdNaturePeople,
  MdFence,
  MdAssignment,
  MdKingBed,
  MdBathtub,
  MdHome,
  MdCalendarToday,
  MdStairs,
  MdLocalFireDepartment,
  MdLightbulb,
  MdRoofing,
  MdRestaurant,
  MdDirectionsCar,
  MdYard,
  MdPool,
  MdConstruction,
  MdNotifications,
  MdElevator,
  MdLandscape,
  MdLocalParking,
  MdEuro,
  MdAccessible,
  MdPeople,
  MdBusiness,
  MdLocalShipping,
  MdRestaurantMenu,
  MdTrain,
  MdCabin,
  MdTerrain,
  MdAccessTime,
  MdBalance,
  MdBolt,
  MdDirectionsBus,
  MdSecurity,
  MdElectricCar,
  MdLightbulbOutline,
  MdAnchor,
  MdSailing,
} from "react-icons/md";

const specificityCategories = [
  {
    name: "Terrains",
    items: [
      {
        label: "Superficie",
        type: "input",
        placeholder: "ex: 5000 m²",
        icon: MdStraighten,
      },
      {
        label: "Zonage",
        type: "select",
        options: ["Résidentiel", "Commercial", "Agricole", "Mixte"],
        icon: MdApartment,
      },
      {
        label: "Topographie",
        type: "select",
        options: ["Plat", "Vallonné", "En pente"],
        icon: MdTerrain,
      },
      {
        label: "Exposition",
        type: "select",
        options: ["Nord", "Sud", "Est", "Ouest"],
        icon: MdWbSunny,
      },
      {
        label: "Accessibilité",
        type: "select",
        options: ["Route pavée", "Chemin de terre"],
        icon: MdLocationOn,
      },
      {
        label: "Présence d'eau",
        type: "select",
        options: [
          "Source naturelle",
          "Rivière",
          "Eau de ville disponible",
          "Aucune",
        ],
        icon: MdWaterDrop,
      },
      {
        label: "Connectivité Internet",
        type: "select",
        options: ["Fibre optique", "4G", "Aucune connectivité"],
        icon: MdWifi,
      },
      {
        label: "Proximité des commodités",
        type: "input",
        placeholder: "ex: Écoles (1 km)",
        icon: MdApartment,
      },
      {
        label: "Végétation",
        type: "select",
        options: ["Arbres fruitiers", "Forêt", "Zone déboisée"],
        icon: MdNaturePeople,
      },
      {
        label: "Type de sol",
        type: "select",
        options: ["Argileux", "Sableux", "Rochers"],
        icon: MdTerrain,
      },
      {
        label: "Clôture",
        type: "select",
        options: ["Présente", "Non présente"],
        icon: MdFence,
      },
      {
        label: "Permis de construire",
        type: "select",
        options: ["Accordé", "En attente", "Non applicable"],
        icon: MdAssignment,
      },
    ],
  },
  {
    name: "Maisons",
    items: [
      {
        label: "Nombre de chambres",
        type: "input",
        placeholder: "ex: 3",
        icon: MdKingBed,
      },
      {
        label: "Nombre de salles de bains",
        type: "input",
        placeholder: "ex: 2",
        icon: MdBathtub,
      },
      {
        label: "Surface habitable",
        type: "input",
        placeholder: "ex: 150 m²",
        icon: MdStraighten,
      },
      {
        label: "Année de construction",
        type: "input",
        placeholder: "ex: 1995",
        icon: MdCalendarToday,
      },
      {
        label: "Étage(s)",
        type: "select",
        options: ["Plain-pied", "2 étages", "3 étages ou plus"],
        icon: MdStairs,
      },
      {
        label: "Type de chauffage",
        type: "select",
        options: ["Central", "Électrique", "Bois"],
        icon: MdLocalFireDepartment,
      },
      {
        label: "Isolation",
        type: "select",
        options: ["Double vitrage", "Triple vitrage", "Aucune"],
        icon: MdLightbulb,
      },
      {
        label: "Type de toiture",
        type: "select",
        options: ["Tuiles", "Zinc", "Ardoise"],
        icon: MdRoofing,
      },
      {
        label: "Cuisine équipée",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdRestaurant,
      },
      {
        label: "Garage",
        type: "select",
        options: ["Présent", "Non présent"],
        icon: MdDirectionsCar,
      },
      {
        label: "Jardin",
        type: "input",
        placeholder: "ex: Surface 50 m²",
        icon: MdYard,
      },
      {
        label: "Piscine",
        type: "select",
        options: ["Intérieure", "Extérieure", "Non présente"],
        icon: MdPool,
      },
      {
        label: "État",
        type: "select",
        options: ["Neuf", "Bon état", "À rénover"],
        icon: MdConstruction,
      },
      {
        label: "Connectivité Internet",
        type: "select",
        options: ["Fibre optique", "DSL", "Aucune"],
        icon: MdWifi,
      },
      {
        label: "Alarme/Sécurité",
        type: "select",
        options: ["Présente", "Non présente"],
        icon: MdNotifications,
      },
    ],
  },
  {
    name: "Appartements",
    items: [
      {
        label: "Étage",
        type: "input",
        placeholder: "ex: 5e étage",
        icon: MdStairs,
      },
      {
        label: "Ascenseur",
        type: "select",
        options: ["Présent", "Non présent"],
        icon: MdElevator,
      },
      {
        label: "Balcon/Terrasse",
        type: "input",
        placeholder: "ex: 10 m²",
        icon: MdWbSunny,
      },
      {
        label: "Vue",
        type: "select",
        options: ["Sur mer", "Sur cour", "Sur montagne", "Sur rue"],
        icon: MdLandscape,
      },
      {
        label: "Parking",
        type: "select",
        options: ["Place réservée", "Parking public", "Non disponible"],
        icon: MdLocalParking,
      },
      {
        label: "Charges mensuelles",
        type: "input",
        placeholder: "ex: 150 €/mois",
        icon: MdEuro,
      },
      {
        label: "Accès PMR",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdAccessible,
      },
      {
        label: "Syndic de copropriété",
        type: "select",
        options: ["Professionnel", "Bénévole"],
        icon: MdPeople,
      },
      {
        label: "Type de résidence",
        type: "select",
        options: ["Standing", "Ordinaire"],
        icon: MdApartment,
      },
    ],
  },
  {
    name: "Immeubles commerciaux",
    items: [
      {
        label: "Surface totale",
        type: "input",
        placeholder: "ex: 200 m²",
        icon: MdStraighten,
      },
      {
        label: "Nombre d'espaces de travail",
        type: "input",
        placeholder: "ex: 10 bureaux",
        icon: MdBusiness,
      },
      {
        label: "Accès logistique",
        type: "select",
        options: ["Quai de chargement", "Accès camion", "Aucun"],
        icon: MdLocalShipping,
      },
      {
        label: "Type d'activité",
        type: "select",
        options: ["Restaurant", "Bureau", "Magasin"],
        icon: MdRestaurantMenu,
      },
      {
        label: "Équipements inclus",
        type: "input",
        placeholder: "ex: Climatisation, Réseau informatique",
        icon: MdLightbulb,
      },
      {
        label: "Proximité des transports",
        type: "input",
        placeholder: "ex: Métro (200 m)",
        icon: MdTrain,
      },
    ],
  },
  {
    name: "Chalets",
    items: [
      {
        label: "Matériaux de construction",
        type: "select",
        options: ["Bois", "Pierre", "Mixte"],
        icon: MdCabin,
      },
      {
        label: "Présence de cheminée",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdLocalFireDepartment,
      },
      {
        label: "Type de chauffage",
        type: "select",
        options: ["Poêle à bois", "Chauffage central", "Électrique"],
        icon: MdLocalFireDepartment,
      },
      {
        label: "Proximité des pistes de ski",
        type: "input",
        placeholder: "ex: 500 m",
        icon: MdTerrain,
      },
      {
        label: "Vue panoramique",
        type: "select",
        options: ["Montagne", "Vallée", "Forêt"],
        icon: MdLandscape,
      },
      {
        label: "Surface du terrain",
        type: "input",
        placeholder: "ex: 1000 m²",
        icon: MdStraighten,
      },
    ],
  },
  {
    name: "Parking/Box",
    items: [
      {
        label: "Type de stationnement",
        type: "select",
        options: ["Extérieur", "Intérieur", "Sous-terrain"],
        icon: MdLocalParking,
      },
      {
        label: "Nombre de places",
        type: "input",
        placeholder: "ex: 2 places",
        icon: MdDirectionsCar,
      },
      {
        label: "Dimensions",
        type: "select",
        options: ["Standard", "Grand véhicule (SUV, camping-car)"],
        icon: MdStraighten,
      },
      {
        label: "Box fermé",
        type: "select",
        options: ["Présent", "Non présent"],
        icon: MdHome,
      },
      {
        label: "Électrification",
        type: "select",
        options: [
          "Prise électrique pour véhicule",
          "Bornes de recharge",
          "Non disponible",
        ],
        icon: MdElectricCar,
      },
      {
        label: "Sécurité",
        type: "select",
        options: [
          "Surveillance vidéo",
          "Portail automatique",
          "Gardiennage",
          "Aucune",
        ],
        icon: MdSecurity,
      },
      {
        label: "Proximité du bien",
        type: "input",
        placeholder: "ex: À 200 m",
        icon: MdLocationOn,
      },
      {
        label: "Accès",
        type: "select",
        options: ["Badge électronique", "Télécommande", "Clé manuelle"],
        icon: MdLightbulbOutline,
      },
      {
        label: "État",
        type: "select",
        options: ["Neuf", "Bon état", "À rénover"],
        icon: MdConstruction,
      },
      {
        label: "Charges mensuelles",
        type: "input",
        placeholder: "ex: 20 €/mois",
        icon: MdEuro,
      },
      {
        label: "Utilisation autorisée",
        type: "select",
        options: ["Véhicule personnel", "Deux-roues", "Stockage"],
        icon: MdDirectionsCar,
      },
      {
        label: "Affectation",
        type: "select",
        options: ["Parking public", "Place privative"],
        icon: MdLocalParking,
      },
      {
        label: "Disponibilité",
        type: "input",
        placeholder: "ex: Immédiate",
        icon: MdAccessTime,
      },
      {
        label: "Éclairage",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdLightbulb,
      },
      {
        label: "Ventilation",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdApartment,
      },
      {
        label: "Proximité d'une borne de recharge",
        type: "input",
        placeholder: "ex: À 50 m",
        icon: MdElectricCar,
      },
    ],
  },
  {
    name: "Bateaux",
    items: [
      {
        label: "Longueur",
        type: "input",
        placeholder: "ex: 10 m",
        icon: MdStraighten,
      },
      {
        label: "Type",
        type: "select",
        options: ["Voilier", "Yacht", "Catamaran"],
        icon: MdSailing,
      },
      {
        label: "Nombre de cabines",
        type: "input",
        placeholder: "ex: 2 cabines",
        icon: MdHome,
      },
      {
        label: "Capacité passagers",
        type: "input",
        placeholder: "ex: 6 personnes",
        icon: MdPeople,
      },
      {
        label: "Moteur",
        type: "select",
        options: ["Diesel", "Électrique", "Solaire"],
        icon: MdLocalShipping,
      },
      {
        label: "Équipements",
        type: "input",
        placeholder: "ex: GPS, Sonar, Climatisation",
        icon: MdConstruction,
      },
      {
        label: "Année de construction",
        type: "input",
        placeholder: "ex: 2015",
        icon: MdCalendarToday,
      },
      {
        label: "Lieu d'amarrage",
        type: "input",
        placeholder: "ex: Port de Marseille",
        icon: MdAnchor,
      },
      {
        label: "Permis requis",
        type: "select",
        options: ["Oui", "Non"],
        icon: MdAssignment,
      },
    ],
  },
  {
    name: "Spécificités générales",
    items: [
      {
        label: "Prix",
        type: "input",
        placeholder: "ex: 250,000 €",
        icon: MdEuro,
      },
      {
        label: "Disponibilité",
        type: "input",
        placeholder: "ex: Immédiate",
        icon: MdAccessTime,
      },
      {
        label: "Statut légal",
        type: "select",
        options: ["En indivision", "Libre de tout litige"],
        icon: MdBalance,
      },
      {
        label: "Énergie",
        type: "select",
        options: [
          "Classe A",
          "Classe B",
          "Classe C",
          "Classe D",
          "Classe E",
          "Classe F",
          "Classe G",
        ],
        icon: MdBolt,
      },
      {
        label: "Accessibilité aux transports",
        type: "input",
        placeholder: "ex: Métro, Bus, Gare",
        icon: MdDirectionsBus,
      },
    ],
  },
];

const SpecificitySelector = ({
  category,
  selectedSpecificities,
  onToggle,
  onValueChange,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">{category.name}</h4>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {category.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`${category.name}-${item.label}`}
                checked={selectedSpecificities.some(
                  (s) => s.label === item.label
                )}
                onCheckedChange={() => onToggle(category.name, item)}
              />
              <label
                htmlFor={`${category.name}-${item.label}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default function AdminPropertyCreate() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<{ url: string; file: File | null }[]>(
    []
  );
  const [selectedSpecificities, setSelectedSpecificities] = useState([]);
  const [propertyType, setPropertyType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleImageUrlAdd = (url: string) => {
    setImages([...images, { url, file: null }]);
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    if (newImages[index].file) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSpecificityToggle = (category, specificity) => {
    setSelectedSpecificities((prev) => {
      const exists = prev.some((s) => s.label === specificity.label);
      if (exists) {
        return prev.filter((s) => s.label !== specificity.label);
      } else {
        return [...prev, { ...specificity, category, value: "" }];
      }
    });
  };

  const handleSpecificityValueChange = (label, value) => {
    setSelectedSpecificities((prev) =>
      prev.map((s) => (s.label === label ? { ...s, value } : s))
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted", {
      title,
      description,
      propertyType,
      images,
      selectedSpecificities,
    });
    // Here you would typically send the data to your backend or perform other actions
    // For now, we'll just reset the form
    setStep(1);
    setImages([]);
    setSelectedSpecificities([]);
    setPropertyType("");
    setTitle("");
    setDescription("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Property Listing</CardTitle>
        <CardDescription>
          Enter the details for the new property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter property title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter property description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select onValueChange={setPropertyType} value={propertyType}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="commercial">
                      Immeuble commercial
                    </SelectItem>
                    <SelectItem value="chalet">Chalet</SelectItem>
                    <SelectItem value="parking">Parking/Box</SelectItem>
                    <SelectItem value="bateau">Bateau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url}
                        alt={`Property image ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-[100px] h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
                    <MdFileUpload className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <Input
                    type="url"
                    placeholder="Or enter image URL"
                    className="flex-grow"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleImageUrlAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      const input = document.querySelector(
                        'input[type="url"]'
                      ) as HTMLInputElement;
                      if (input.value) {
                        handleImageUrlAdd(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    <MdImage className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Specificities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specificityCategories.map((category, index) => (
                  <SpecificitySelector
                    key={index}
                    category={category}
                    selectedSpecificities={selectedSpecificities}
                    onToggle={handleSpecificityToggle}
                    onValueChange={handleSpecificityValueChange}
                  />
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Specificities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecificities.slice(0, 4).map((spec, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="p-2 flex items-center"
                    >
                      {spec.icon && <spec.icon className="w-4 h-4 mr-2" />}
                      {spec.label}
                      {spec.type === "input" ? (
                        <Input
                          type="text"
                          placeholder={spec.placeholder}
                          className="w-24 ml-2 h-6 text-xs"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecificityValueChange(
                              spec.label,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <Select
                          onValueChange={(value) =>
                            handleSpecificityValueChange(spec.label, value)
                          }
                        >
                          <SelectTrigger className="w-24 ml-2 h-6 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {spec.options.map((option, optionIndex) => (
                              <SelectItem key={optionIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit}>
            Create Property Listing
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
