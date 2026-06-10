import { Property, PropertyFilter, PropertySearchParams } from '../types/properties.types';
import { bunnyCdnService } from '@/features/upload/services/bunnyCdnService';

class PropertyService {
  private properties: Property[] = [];
  private isInitialized: boolean = false;

  constructor() {
    // Ne pas faire d'appels API pendant la phase de build
    if (typeof window !== 'undefined') {
      this.fetchProperties();
    }
  }

  /**
   * Normalise un objet property en convertissant les dates string en objets Date
   */
  private normalizeProperty(property: Partial<Property> & { createdAt?: string | Date; updatedAt?: string | Date }): Property {
    if (!property) return property;

    const normalized = { ...property };

    // Convertir les dates string en objets Date
    if (normalized.createdAt && typeof normalized.createdAt === 'string') {
      normalized.createdAt = new Date(normalized.createdAt);
    }

    if (normalized.updatedAt && typeof normalized.updatedAt === 'string') {
      normalized.updatedAt = new Date(normalized.updatedAt);
    }

    if (normalized.publishedAt && typeof normalized.publishedAt === 'string') {
      normalized.publishedAt = new Date(normalized.publishedAt);
    }

    return normalized as Property;
  }

  /**
   * Normalise un tableau de properties
   */
  private normalizeProperties(properties: Array<Partial<Property> & { createdAt?: string | Date; updatedAt?: string | Date }>): Property[] {
    if (!properties || !Array.isArray(properties)) return [];
    return properties.map((property) => this.normalizeProperty(property));
  }

  /**
   * Récupère les propriétés depuis l'API
   */
  private async fetchProperties() {
    // Ne pas faire d'appels API pendant la phase de build
    if (typeof window === 'undefined') {
      this.properties = [];
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/properties`);

      if (response.ok) {
        const responseData = await response.json();

        let propertiesData;

        if (responseData.success && responseData.data) {
          propertiesData = responseData.data;
        } else {
          propertiesData = responseData;
        }

        if (propertiesData) {
          if (Array.isArray(propertiesData)) {
            this.properties = this.normalizeProperties(propertiesData);
          } else {
            this.properties = [];
          }
        } else {
          this.properties = [];
        }
      } else {
        if (!Array.isArray(this.properties)) {
          this.properties = [];
        }
      }
    } catch (error) {
      // Silencer les erreurs pendant le build
      if (typeof window !== 'undefined') {
        console.error('Erreur lors de la récupération des propriétés:', error);
      }
      if (!Array.isArray(this.properties)) {
        this.properties = [];
      }
    }
  }

  /**
   * Récupère toutes les propriétés avec filtres et pagination
   */
  async getAllProperties(
    params?: PropertySearchParams
  ): Promise<{ data: Property[]; total: number; page: number }> {
    try {
      const queryParams = new URLSearchParams();

      // Request list view for better performance
      queryParams.set('view', 'list');

      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);

      // Add filter params
      if (params?.filter) {
        if (params.filter.propertyType) {
          const types = Array.isArray(params.filter.propertyType)
            ? params.filter.propertyType
            : [params.filter.propertyType];
          queryParams.set('propertyType', types.join(','));
        }
        if (params.filter.transactionType)
          queryParams.set('transactionType', params.filter.transactionType);
        if (params.filter.city) queryParams.set('city', params.filter.city);
        if (params.filter.status) queryParams.set('status', params.filter.status);
        if (params.filter.minPrice) queryParams.set('minPrice', params.filter.minPrice.toString());
        if (params.filter.maxPrice) queryParams.set('maxPrice', params.filter.maxPrice.toString());
        if (params.filter.minSize) queryParams.set('minSize', params.filter.minSize.toString());
        if (params.filter.maxSize) queryParams.set('maxSize', params.filter.maxSize.toString());
        if (params.filter.minBedrooms)
          queryParams.set('minBedrooms', params.filter.minBedrooms.toString());
        if (params.filter.maxBedrooms)
          queryParams.set('maxBedrooms', params.filter.maxBedrooms.toString());
        if (params.filter.search) queryParams.set('search', params.filter.search);
        if (params.filter.isFeatured !== undefined)
          queryParams.set('isFeatured', params.filter.isFeatured.toString());
        if (params.filter.amenities && params.filter.amenities.length > 0) {
          queryParams.set('amenities', params.filter.amenities.join(','));
        }
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const url = `${baseUrl}/api/properties?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const responseData = await response.json();

      return {
        data: this.normalizeProperties(responseData.data || []),
        total: responseData.total || 0,
        page: responseData.page || 1,
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        data: [],
        total: 0,
        page: 1,
      };
    }
  }

  /**
   * Récupère une propriété par ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/properties/${id}`);

      if (response.ok) {
        const responseData = await response.json();

        let propertyData;
        if (responseData.success && responseData.data) {
          propertyData = responseData.data;
        } else {
          propertyData = responseData;
        }

        const normalizedProperty = this.normalizeProperty(propertyData);

        // S'assurer que les images sont un tableau
        if (!normalizedProperty.images) {
          normalizedProperty.images = [];
        } else if (!Array.isArray(normalizedProperty.images)) {
          try {
            if (typeof normalizedProperty.images === 'string') {
              const parsedImages = JSON.parse(normalizedProperty.images);
              normalizedProperty.images = Array.isArray(parsedImages) ? parsedImages : [];
            } else {
              normalizedProperty.images = [];
            }
          } catch (e) {
            console.warn(`Erreur lors du parsing des images de la propriété ${id}:`, e);
            normalizedProperty.images = [];
          }
        }

        return normalizedProperty;
      }
    } catch (error) {
      console.warn(`Erreur lors de la récupération de la propriété ${id}:`, error);
    }

    return null;
  }

  /**
   * Récupère les propriétés en vedette
   */
  async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    try {
      const result = await this.getAllProperties({
        limit,
        filter: { isFeatured: true, status: 'AVAILABLE' },
        sort: 'date_desc',
      });
      return result.data;
    } catch (error) {
      console.warn('Impossible de récupérer les propriétés en vedette:', error);
      return [];
    }
  }

  /**
   * Récupère les villes disponibles
   */
  async getCities(): Promise<string[]> {
    try {
      await this.fetchProperties();
    } catch (error) {
      console.warn('Impossible de récupérer les propriétés depuis l\'API');
    }

    const cities = new Set(this.properties.map((property) => property.city));
    return Array.from(cities).filter((city) => city && city.trim() !== '');
  }

  /**
   * Supprime une propriété et toutes ses images associées
   */
  async deleteProperty(propertyId: string, images: string[]): Promise<boolean> {
    try {
      // 1. Supprimer toutes les images associées
      const imagesDeleted = await this.deletePropertyImages(propertyId, images);

      if (!imagesDeleted) {
        console.warn(`Problème lors de la suppression des images de la propriété ${propertyId}, mais on continue`);
      }

      // 2. Supprimer la propriété de la base de données via l'API
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return false;
        }
      } catch (dbError) {
        console.warn(`Erreur lors de la suppression de la propriété ${propertyId}:`, dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la propriété:', error);
      return false;
    }
  }

  /**
   * Supprime toutes les images associées à une propriété
   */
  async deletePropertyImages(propertyId: string, images: string[]): Promise<boolean> {
    try {
      if (!images || images.length === 0) {
        return true;
      }

      const validImages = images.filter((img) => img && img.trim() !== '');

      if (validImages.length === 0) {
        return true;
      }

      const deletePromises = validImages.map((imageUrl) => {
        if (!imageUrl || typeof imageUrl !== 'string') {
          console.warn('URL d\'image invalide ignorée:', imageUrl);
          return Promise.resolve(true);
        }

        if (imageUrl.includes('b-cdn.net') || imageUrl.includes('storage.bunnycdn.com')) {
          return bunnyCdnService.deleteFile(imageUrl);
        } else {
          return Promise.resolve(true);
        }
      });

      const results = await Promise.allSettled(deletePromises);

      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value === true) {
          successCount++;
        } else {
          failureCount++;
        }
      });

      return successCount > 0 || validImages.length === 0;
    } catch (error) {
      console.error('Erreur lors de la suppression des images de la propriété:', error);
      return false;
    }
  }
}

export const propertyService = new PropertyService();
