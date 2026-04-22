// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { propertyService } from '@/features/properties/services/propertyService';
import { isDatabaseConnectionReady } from '@/infrastructure/database/prisma';
import { mockProperty, mockProperties, mockPaginatedResponse } from '../fixtures/mockPropertyData';

// Mock the database connection check
vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $disconnect: vi.fn(),
  },
  isDatabaseConnectionReady: vi.fn(),
  disconnectDatabase: vi.fn(),
}));

describe('PropertyService - Data Connection Tests', () => {
  beforeEach(() => {
    // resetAllMocks clears call history AND queued mockResolvedValueOnce values
    vi.resetAllMocks();
    // Stub fetch globally so it works in happy-dom (window.fetch is non-configurable)
    vi.stubGlobal('fetch', vi.fn());
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('getAllProperties with connection check', () => {
    it('should fetch properties when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: mockProperties,
          total: 3,
          page: 1,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getAllProperties({ page: 1, limit: 10 });

      // Assert
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/properties?view=list&page=1&limit=10')
      );
    });

    it('should return empty array when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Simulate fetch failure when DB is not ready
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Database not available' }),
      } as Response);

      const result = await propertyService.getAllProperties();

      // Assert
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle network errors when connection check fails', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      // Act
      const isReady = await isDatabaseConnectionReady();
      const result = await propertyService.getAllProperties();

      // Assert
      expect(isReady).toBe(false);
      expect(result.data).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should filter properties correctly when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const filteredProperties = mockProperties.filter((p) => p.city === 'Paris');

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: filteredProperties,
          total: 1,
          page: 1,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getAllProperties({
        filter: { city: 'Paris' },
      });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].city).toBe('Paris');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('city=Paris')
      );
    });
  });

  describe('getPropertyById with connection check', () => {
    it('should fetch property by ID when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProperty,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getPropertyById('1');

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.title).toBe('Belle Maison Moderne');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/properties/1')
      );
    });

    it('should return null when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      const result = await propertyService.getPropertyById('1');

      // Assert
      expect(result).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it('should handle missing property gracefully', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      // Act
      const result = await propertyService.getPropertyById('999');

      // Assert — service returns null for 404 without warning (falls through to return null)
      expect(result).toBeNull();
    });
  });

  describe('getFeaturedProperties with connection check', () => {
    it('should fetch featured properties when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const featuredProperties = mockProperties.filter((p) => p.isFeatured);

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: featuredProperties,
          total: featuredProperties.length,
          page: 1,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getFeaturedProperties(3);

      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.isFeatured)).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('isFeatured=true')
      );
    });

    it('should return empty array when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Connection failed'));

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      const result = await propertyService.getFeaturedProperties();

      // Assert — getAllProperties catches the error internally and returns [],
      // so getFeaturedProperties returns [] without calling console.warn itself
      expect(result).toEqual([]);
    });
  });

  describe('Property data normalization with connection check', () => {
    it('should normalize property dates correctly when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const propertyWithStringDates = {
        ...mockProperty,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: propertyWithStringDates,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getPropertyById('1');

      // Assert
      expect(result).toBeDefined();
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle invalid image data gracefully', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const propertyWithInvalidImages = {
        ...mockProperty,
        images: 'invalid-json-string',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: propertyWithInvalidImages,
        }),
      } as Response);

      // Act
      const result = await propertyService.getPropertyById('1');

      // Assert
      expect(result?.images).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Pagination and filtering with connection check', () => {
    it('should handle pagination parameters correctly when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: mockProperties.slice(0, 2),
          total: 3,
          page: 1,
        }),
      } as Response);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const result = await propertyService.getAllProperties({
        page: 1,
        limit: 2,
      });

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=2')
      );
    });

    it('should build query parameters correctly for complex filters', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1 }),
      } as Response);

      // Act
      await propertyService.getAllProperties({
        page: 1,
        limit: 10,
        sort: 'price_asc',
        filter: {
          city: 'Paris',
          minPrice: 200000,
          maxPrice: 500000,
          minBedrooms: 2,
          status: 'AVAILABLE',
        },
      });

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/city=Paris/)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/minPrice=200000/)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/maxPrice=500000/)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/minBedrooms=2/)
      );
    });
  });
});
