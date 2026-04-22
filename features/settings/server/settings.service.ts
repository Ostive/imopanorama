import { settingsRepository } from '@/infrastructure/database/repositories';
import { Prisma } from '@prisma/client';

/* ─── Types ────────────────────────────────────────────────── */

interface SettingsMap {
  [category: string]: Record<string, unknown>;
}

/* ─── Service ──────────────────────────────────────────────── */

export const settingsServerService = {
  /**
   * Récupère un paramètre par clé
   */
  async getByKey(key: string) {
    return settingsRepository.findUnique(key);
  },

  /**
   * Récupère tous les paramètres, optionnellement par catégorie
   */
  async getAll(category?: string): Promise<SettingsMap> {
    const where = category ? { category } : {};
    const settings = await settingsRepository.findMany(where);

    const result: SettingsMap = {};
    for (const setting of settings) {
      if (!result[setting.category]) {
        result[setting.category] = {};
      }
      result[setting.category] = {
        ...result[setting.category],
        ...(setting.value as object),
      };
    }
    return result;
  },

  /**
   * Sauvegarde des paramètres par catégorie (upsert)
   */
  async save(settings: Record<string, unknown>) {
    const saved = [];
    for (const [category, value] of Object.entries(settings)) {
      const setting = await settingsRepository.upsert(category, {
        value: value as Prisma.InputJsonValue,
        category,
      });
      saved.push(setting);
    }
    return saved;
  },

  /**
   * Supprime un paramètre par clé
   */
  async remove(key: string): Promise<boolean> {
    const exists = await settingsRepository.exists(key);
    if (!exists) return false;
    await settingsRepository.delete(key);
    return true;
  },
};
