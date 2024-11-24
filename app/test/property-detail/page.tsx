"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Car,
  TreesIcon as Tree,
  Home,
  Expand,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";

export default function PropertyDetailPage() {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [countryCode, setCountryCode] = useState("fr");
  const countryOptions = [
    { value: "fr", label: "France", flag: "🇫🇷", code: "+33" },
    { value: "uk", label: "United Kingdom", flag: "🇬🇧", code: "+44" },
    { value: "us", label: "United States", flag: "🇺🇸", code: "+1" },
  ];

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const property = {
    title: "Villa Luxueuse en Bord de Mer",
    price: "2 500 000 €",
    address: "123 Avenue de l'Océan, Biarritz 64200",
    bedrooms: 4,
    bathrooms: 3.5,
    area: 325, // m²
    garage: 2,
    lotSize: "2000 m²",
    description:
      "Découvrez le summum du luxe côtier dans cette magnifique villa en bord de mer. Offrant une vue panoramique sur l'océan, ce chef-d'œuvre moderne dispose d'un plan ouvert, d'une cuisine gastronomique et d'un accès direct à la plage. Parfait pour ceux qui recherchent un style de vie luxueux au bord de la mer.",
    features: [
      "Vue sur l'océan",
      "Accès direct à la plage",
      "Cuisine moderne",
      "Piscine privée",
      "Home cinéma",
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=80",
    ],
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46021.88972916131!2d-1.5834382765064172!3d43.48302510277518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd51152b0af31e33%3A0x40665174813a830!2s64200%20Biarritz%2C%20France!5e0!3m2!1sen!2sus!4v1652813745179!5m2!1sen!2sus",
    agent: {
      name: "Sophie Martin",
      title: "Agent Immobilier Senior",
      avatar: "https://i.pravatar.cc/150?img=48",
    },
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % property.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + property.images.length) % property.images.length
    );
  };

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-7xl"
      data-test="property-page"
    >
      {/* Photo Gallery Header */}
      <div className="mb-8">
        {isMobile ? (
          <div
            className="relative aspect-[4/3]"
            data-test="mobile-image-slider"
          >
            <Image
              src={property.images[currentImageIndex]}
              alt={`Image de la propriété ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                onClick={prevImage}
                className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Image précédente</span>
              </Button>
              <Button
                variant="ghost"
                onClick={nextImage}
                className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Image suivante</span>
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-4 gap-4 h-[600px]"
            data-test="photo-gallery-grid"
          >
            <div className="col-span-2 row-span-2 relative">
              <Image
                src={property.images[0]}
                alt="Image principale de la propriété"
                fill
                className="object-cover rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                data-test="main-image"
              />
            </div>
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Image de la propriété ${index + 2}`}
                  fill
                  className="object-cover rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                  data-test={`grid-image-${index}`}
                />
                {index === 3 && (
                  <Button
                    variant="secondary"
                    className="absolute inset-0 bg-black/50 text-white hover:bg-black/60 transition-colors duration-300"
                    onClick={() => setShowAllPhotos(true)}
                    data-test="view-all-photos"
                  >
                    <Expand className="h-5 w-5 mr-2" />
                    Voir toutes les photos
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Information */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-test="property-title">
              {property.title}
            </h1>
            <p
              className="text-3xl font-semibold text-primary"
              data-test="property-price"
            >
              {property.price}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span data-test="property-address">{property.address}</span>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-gray-200"
            data-test="property-features"
          >
            <FeatureItem icon={Bed} text={`${property.bedrooms} Chambres`} />
            <FeatureItem
              icon={Bath}
              text={`${property.bathrooms} Salles de bain`}
            />
            <FeatureItem icon={Square} text={`${property.area} m²`} />
            <FeatureItem icon={Car} text={`${property.garage} Garage`} />
            <FeatureItem icon={Tree} text={`${property.lotSize} Terrain`} />
            <FeatureItem icon={Home} text="Villa" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p
              className="text-gray-600 leading-relaxed"
              data-test="property-description"
            >
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Caractéristiques</h2>
            <div
              className="flex flex-wrap gap-2"
              data-test="property-amenities"
            >
              {property.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <form
              className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md"
              data-test="contact-form"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={property.agent.avatar}
                    alt={property.agent.name}
                  />
                  <AvatarFallback>
                    {property.agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{property.agent.name}</h3>
                  <Badge variant="secondary">{property.agent.title}</Badge>
                </div>
              </div>
              <Input placeholder="Votre Nom" data-test="input-name" />
              <Input
                type="email"
                placeholder="Votre Email"
                data-test="input-email"
              />
              <div className="flex space-x-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Votre Téléphone"
                  className="flex-1"
                  data-test="input-phone"
                />
              </div>
              <Textarea
                placeholder="Votre Message"
                rows={4}
                data-test="input-message"
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J&apos;accepte la politique de confidentialité
                </label>
              </div>
              <Button
                type="submit"
                className="w-full"
                data-test="submit-button"
              >
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Localisation</h2>
        <div
          className="aspect-video rounded-lg overflow-hidden shadow-lg"
          data-test="property-map"
        >
          <iframe
            src={property.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Carte de localisation de la propriété"
          ></iframe>
        </div>
      </div>

      {/* All Photos Modal */}
      {showAllPhotos && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto"
          data-test="all-photos-modal"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-black bg-opacity-75 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-white">
                Toutes les photos
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowAllPhotos(false)}
                className="text-white hover:text-gray-300 transition-colors duration-300"
                data-test="close-modal"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={image}
                    alt={`Image de la propriété ${index + 1}`}
                    fill
                    className="object-cover rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                    data-test={`modal-image-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="h-6 w-6 mb-2 text-primary" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
