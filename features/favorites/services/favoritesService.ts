import { prisma } from '@/infrastructure/database/prisma';

/**
 * Service pour gérer les favoris des utilisateurs
 */
export const favoritesService = {
  /**
   * Ajouter une propriété aux favoris d'un utilisateur
   */
  async addFavorite(userId: string, propertyId: string) {
    try {
      // Vérifier si le favori existe déjà
      const existingFavorite = await prisma.propertyFavorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId
          }
        }
      });

      // Si le favori existe déjà, ne rien faire
      if (existingFavorite) {
        return existingFavorite;
      }

      // Créer un nouveau favori
      return await prisma.propertyFavorite.create({
        data: {
          userId,
          propertyId
        },
        include: {
          property: true
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      throw new Error('Impossible d\'ajouter cette propriété aux favoris');
    }
  },

  /**
   * Supprimer une propriété des favoris d'un utilisateur
   */
  async removeFavorite(userId: string, propertyId: string) {
    try {
      return await prisma.propertyFavorite.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      throw new Error('Impossible de supprimer cette propriété des favoris');
    }
  },

  /**
   * Vérifier si une propriété est dans les favoris d'un utilisateur
   */
  async isFavorite(userId: string, propertyId: string) {
    try {
      const favorite = await prisma.propertyFavorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId
          }
        }
      });
      return !!favorite;
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  },

  /**
   * Récupérer tous les favoris d'un utilisateur
   */
  async getUserFavorites(userId: string) {
    try {
      const favorites = await prisma.propertyFavorite.findMany({
        where: {
          userId
        },
        include: {
          property: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return favorites;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw new Error('Impossible de récupérer les favoris');
    }
  },

  /**
   * Supprimer tous les favoris d'un utilisateur
   */
  async clearUserFavorites(userId: string) {
    try {
      return await prisma.propertyFavorite.deleteMany({
        where: {
          userId
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw new Error('Impossible de supprimer tous les favoris');
    }
  },

  /**
   * Compter le nombre de favoris d'un utilisateur
   */
  async countUserFavorites(userId: string) {
    try {
      return await prisma.propertyFavorite.count({
        where: {
          userId
        }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des favoris:', error);
      return 0;
    }
  }
};
