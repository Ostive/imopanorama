import { favoriteRepository } from '@/infrastructure/database/repositories';

/* ─── Service ──────────────────────────────────────────────── */

export const favoritesServerService = {
  /**
   * Récupère les favoris d'un utilisateur
   */
  async getByUserId(userId: string) {
    return favoriteRepository.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Ajoute un favori
   */
  async add(userId: string, propertyId: string) {
    const existing = await favoriteRepository.findFirst({ userId, propertyId });
    if (existing) return existing;

    return favoriteRepository.create(
      { userId, propertyId },
      { property: true },
    );
  },

  /**
   * Supprime un favori
   */
  async remove(userId: string, propertyId: string): Promise<boolean> {
    const existing = await favoriteRepository.findFirst({ userId, propertyId });
    if (!existing) return false;
    await favoriteRepository.delete(existing.id);
    return true;
  },

  /**
   * Vérifie si un bien est en favori
   */
  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const count = await favoriteRepository.count({ userId, propertyId });
    return count > 0;
  },
};
