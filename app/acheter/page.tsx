// import { auth } from "@/lib/auth";
// import { signOut } from "@/lib/auth";
// import Link from "next/link";
// import { Button } from "@/components/ui/button"; // Assurez-vous que le chemin est correct pour votre projet

// export default async function Page() {
//   const session = await auth();

//   return (
//     <div className="flex justify-center items-center h-screen">
//       {session ? (
//         <div>
//           {JSON.stringify(session)}
//           <h1>Welcome, {session.user?.name ?? "User"}</h1>
//           <p>Your email is {session.user?.email ?? "unknown"}</p>
//           <form
//             action={async () => {
//               "use server";
//               await signOut();
//             }}
//           >
//             <Button type="submit">Logout</Button>
//           </form>
//         </div>
//       ) : (
//         <div>
//           <p>You are not logged in.</p>
//           <p>Do you want to sign in?</p>
//           <Link href="/sign-in">Sign In</Link>


'use client'  // Directive pour indiquer que ce fichier est un composant client

import { useEffect, useState } from "react";
import Proprietes from '@/components/property/properties';
import Header from "@/components/headers/header1";
import PropertySearch from "@/components/search/SearchFilter";

export default function Page() {
  const [properties, setProperties] = useState<any[]>([]); // Déclare un état pour les propriétés
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]); // Déclare un état pour les propriétés filtrées
  const [loading, setLoading] = useState<boolean>(true); // Déclare un état pour savoir si les données sont en cours de chargement

  // Récupérer les propriétés depuis l'API lors du montage du composant
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data); // Stocker les propriétés dans l'état
          setFilteredProperties(data); // Initialiser les propriétés filtrées avec toutes les propriétés
        } else {
          console.error('Erreur lors de la récupération des propriétés');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des propriétés:', error);
      } finally {
        setLoading(false); // Changer l'état pour indiquer que le chargement est terminé
      }
    };

    fetchProperties(); // Appeler la fonction pour récupérer les propriétés
  }, []);

  // Fonction pour filtrer les propriétés en fonction des critères
  const handleSearch = (filters: any) => {
    const filtered = properties.filter((property) => {
      // Filtrage par prix
      let priceMatch = true;
      if (filters.minPrice || filters.maxPrice) {
        //console.log(filters.maxPrice);
        priceMatch = property.price >= filters.minPrice && property.price <= filters.maxPrice;
      }

      // Filtrage par Résidentielle
      let bedroomsMatch = true;
      if (property.ResidentialProperty?.bedrooms && filters.bedrooms){
        bedroomsMatch = property.ResidentialProperty.bedrooms == filters.bedrooms;
      }

      // Filtrage par Résidentielle
      let bathroomsMatch = true;
      if (property.ResidentialProperty?.bathrooms && filters.bathrooms){
        bathroomsMatch = property.ResidentialProperty?.bathrooms == filters.bathrooms;
      }

      // Filtrage par Surface Habitable
      let livingSpaceMatch = true;
      if (property.ResidentialProperty?.living_space && filters.livingSpace){
        livingSpaceMatch = filters.livingSpace[0] <= property.ResidentialProperty.living_space && property.ResidentialProperty.living_space <= filters.livingSpace[1];
      }

      // Filtrage par Etage
      let stageMatch = true;
      if (property.ResidentialProperty?.floors && filters.floors){
        stageMatch = filters.floors == property.ResidentialProperty.floors;
      }

      // Filtrage par taille de terrain
      let landareaMatch = true;
      if (property.LandProperty?.land_area) { // Vérifie si land_area existe
        if (filters.minLandArea || filters.maxLandArea) {
          landareaMatch = property.LandProperty.land_area >= filters.minLandArea && property.LandProperty.land_area <= filters.maxLandArea;
        } 
      }

      // Filtrage par taille du bateau
      let boatLengthMatch = true;
      if (property.BoatProperty?.length) {
        if (filters.boatMinLength || filters.boatMaxLength) {
          boatLengthMatch = property.BoatProperty.length >= filters.boatMinLength && property.BoatProperty.length <= filters.boatMaxLength;
        } 
      } 

      // Filtrage par taille du parking
      let parkingSizeMatch = true;
      if (property.ParkingProperty?.size) {
        if (filters.minParkingSize || filters.maxParkingSize) {
          parkingSizeMatch = property.ParkingProperty.size >= filters.minParkingSize && property.ParkingProperty.size <= filters.maxParkingSize;
        } 
      } 
      
      // Filtrage par localisation
      const locationMatch = filters.location ? property.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
  
      // Filtrage par nom de propriété
      const nameMatch = filters.search ? property.title.toLowerCase().includes(filters.search.toLowerCase()) : true;
  
      // Filtrage par type de propriété
      let typeMatch = true;
      if (filters.type && filters.type !== 'all') { // Si le type n'est pas "Tous"
        typeMatch = property.type === filters.type;
      }
  
      // Retourner les propriétés qui correspondent à tous les critères
      return priceMatch && locationMatch && nameMatch && typeMatch && landareaMatch && parkingSizeMatch && boatLengthMatch && bedroomsMatch && bathroomsMatch && livingSpaceMatch && stageMatch;
    });
  
    setFilteredProperties(filtered); // Mettre à jour les propriétés filtrées
  };
  

  if (loading) {
    return <div>Chargement...</div>; // Afficher un message de chargement tant que les données ne sont pas récupérées
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <Header/>
      </div>
      <div>
        <PropertySearch onSearch={handleSearch} /> {/* Passer handleSearch au composant PropertySearch */}
      </div>

      {filteredProperties.length === 0 ? (
        <p>Aucune propriété trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grille pour 3 éléments */}
          {filteredProperties.map((property) => (
            <Proprietes
              key={property.id}
              id={property.id}
              titre={property.title}
              adresse={property.location}
              images={property.images} // Ajoutez ici vos images ou récupérez-les depuis la base de données si disponible
              description={property.description || "Pas de description disponible"}
              prix={property.price}
              type={property.type}
              residential={property.ResidentialProperty || undefined}
              commercial={property.CommercialProperty || undefined}
              parking={property.ParkingProperty || undefined}
              land={property.LandProperty || undefined}
              boat={property.BoatProperty || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
