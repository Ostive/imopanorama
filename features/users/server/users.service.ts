import { userRepository } from '@/infrastructure/database/repositories';

/* ─── Types ────────────────────────────────────────────────── */

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  phone: true,
  company: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
} as const;

/* ─── Service ──────────────────────────────────────────────── */

export const usersServerService = {
  /**
   * Liste tous les utilisateurs (sans mot de passe)
   */
  async list() {
    return userRepository.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Récupère un utilisateur par ID
   */
  async getById(id: string) {
    return userRepository.findUnique(id, USER_SELECT);
  },

  /**
   * Met à jour un utilisateur
   */
  async update(id: string, data: Record<string, unknown>) {
    const exists = await userRepository.exists(id);
    if (!exists) return null;
    return userRepository.update(id, data);
  },

  /**
   * Active/Désactive un utilisateur
   */
  async toggleActive(id: string): Promise<{ isActive: boolean } | null> {
    const user = await userRepository.findUnique(id);
    if (!user) return null;
    const updated = await userRepository.update(id, { isActive: !user.isActive });
    return { isActive: updated.isActive };
  },
};
