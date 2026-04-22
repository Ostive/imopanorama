import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoist mock factories so vi.mock() can access them at module evaluation time
const mockFindUnique = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());
const mockFindMany = vi.hoisted(() => vi.fn());
const mockDeleteMany = vi.hoisted(() => vi.fn());
const mockCount = vi.hoisted(() => vi.fn());

vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    propertyFavorite: {
      findUnique: mockFindUnique,
      create: mockCreate,
      delete: mockDelete,
      findMany: mockFindMany,
      deleteMany: mockDeleteMany,
      count: mockCount,
    },
  },
}));

import { favoritesService } from '@/features/favorites/services/favoritesService';

const USER_ID = 'user-1';
const PROPERTY_ID = 'prop-1';

const mockFavoriteRecord = {
  id: 'fav-1',
  userId: USER_ID,
  propertyId: PROPERTY_ID,
  createdAt: new Date(),
  property: { id: PROPERTY_ID, title: 'Belle Maison' },
};

describe('favoritesService.addFavorite', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return the existing favorite if already favorited', async () => {
    mockFindUnique.mockResolvedValueOnce(mockFavoriteRecord);

    const result = await favoritesService.addFavorite(USER_ID, PROPERTY_ID);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { userId_propertyId: { userId: USER_ID, propertyId: PROPERTY_ID } },
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(result).toEqual(mockFavoriteRecord);
  });

  it('should create a new favorite if not already favorited', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce(mockFavoriteRecord);

    const result = await favoritesService.addFavorite(USER_ID, PROPERTY_ID);

    expect(mockCreate).toHaveBeenCalledWith({
      data: { userId: USER_ID, propertyId: PROPERTY_ID },
      include: { property: true },
    });
    expect(result).toEqual(mockFavoriteRecord);
  });

  it('should throw a user-friendly error on database failure', async () => {
    mockFindUnique.mockRejectedValueOnce(new Error('DB error'));

    await expect(favoritesService.addFavorite(USER_ID, PROPERTY_ID)).rejects.toThrow(
      'Impossible d\'ajouter cette propriété aux favoris'
    );
  });
});

describe('favoritesService.removeFavorite', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete the favorite record', async () => {
    mockDelete.mockResolvedValueOnce(mockFavoriteRecord);

    const result = await favoritesService.removeFavorite(USER_ID, PROPERTY_ID);

    expect(mockDelete).toHaveBeenCalledWith({
      where: { userId_propertyId: { userId: USER_ID, propertyId: PROPERTY_ID } },
    });
    expect(result).toEqual(mockFavoriteRecord);
  });

  it('should throw a user-friendly error on database failure', async () => {
    mockDelete.mockRejectedValueOnce(new Error('Record not found'));

    await expect(favoritesService.removeFavorite(USER_ID, PROPERTY_ID)).rejects.toThrow(
      'Impossible de supprimer cette propriété des favoris'
    );
  });
});

describe('favoritesService.isFavorite', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return true when the property is favorited', async () => {
    mockFindUnique.mockResolvedValueOnce(mockFavoriteRecord);

    const result = await favoritesService.isFavorite(USER_ID, PROPERTY_ID);

    expect(result).toBe(true);
  });

  it('should return false when the property is not favorited', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await favoritesService.isFavorite(USER_ID, PROPERTY_ID);

    expect(result).toBe(false);
  });

  it('should return false (not throw) on database error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFindUnique.mockRejectedValueOnce(new Error('DB error'));

    const result = await favoritesService.isFavorite(USER_ID, PROPERTY_ID);

    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('favoritesService.getUserFavorites', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return all favorites for a user ordered by newest first', async () => {
    const favorites = [mockFavoriteRecord, { ...mockFavoriteRecord, id: 'fav-2' }];
    mockFindMany.mockResolvedValueOnce(favorites);

    const result = await favoritesService.getUserFavorites(USER_ID);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toHaveLength(2);
  });

  it('should return an empty array when user has no favorites', async () => {
    mockFindMany.mockResolvedValueOnce([]);

    const result = await favoritesService.getUserFavorites(USER_ID);

    expect(result).toEqual([]);
  });

  it('should throw a user-friendly error on database failure', async () => {
    mockFindMany.mockRejectedValueOnce(new Error('DB error'));

    await expect(favoritesService.getUserFavorites(USER_ID)).rejects.toThrow();
  });
});
