// Interface pour les données de contact propriété
export interface PropertyContactData {
  propertyTitle: string;
  propertyId: string;
  propertyPrice: string;
  propertyLocation: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
}

// Interface pour le contact générique
export interface GenericContactData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
}

// Interface pour les données de devis BatiPanorama
export interface BatiQuoteData {
  projectType: string;
  budget: string;
  location: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
}
