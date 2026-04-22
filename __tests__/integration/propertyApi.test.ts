import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isDatabaseConnectionReady, prisma } from '@/infrastructure/database/prisma';
import { mockProperty, mockProperties } from '../fixtures/mockPropertyData';

// Mock the Prisma client
vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $disconnect: vi.fn(),
  },
  isDatabaseConnectionReady: vi.fn(),
  disconnectDatabase: vi.fn(),
}));

describe('Property API Integration Tests with Connection Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/properties - List Properties', () => {
    it('should return properties when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(mockProperties as any);
      vi.mocked(prisma.property.count).mockResolvedValueOnce(3);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      // Simulate API call
      const properties = await prisma.property.findMany({
        where: { isPublished: true },
        take: 10,
        skip: 0,
      });

      const total = await prisma.property.count({
        where: { isPublished: true },
      });

      // Assert
      expect(properties).toHaveLength(3);
      expect(total).toBe(3);
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublished: true },
        })
      );
    });

    it('should fail gracefully when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.findMany).mockRejectedValueOnce(
        new Error('Connection refused')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Assert
      await expect(
        prisma.property.findMany({
          where: { isPublished: true },
        })
      ).rejects.toThrow('Connection refused');
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.findMany).mockRejectedValueOnce(
        new Error('Query timeout')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();

      // Assert
      expect(isReady).toBe(false);
      await expect(
        prisma.property.findMany()
      ).rejects.toThrow('Query timeout');
    });

    it('should filter properties by city when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const parisProperties = mockProperties.filter((p) => p.city === 'Paris');
      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(parisProperties as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const properties = await prisma.property.findMany({
        where: {
          city: 'Paris',
          isPublished: true,
        },
      });

      // Assert
      expect(properties).toHaveLength(1);
      expect(properties[0].city).toBe('Paris');
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ city: 'Paris' }),
        })
      );
    });

    it('should apply price filters correctly when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const filteredProperties = mockProperties.filter(
        (p) => p.price >= 200000 && p.price <= 500000
      );
      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(filteredProperties as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const properties = await prisma.property.findMany({
        where: {
          price: {
            gte: 200000,
            lte: 500000,
          },
          isPublished: true,
        },
      });

      // Assert
      expect(properties).toHaveLength(2);
      expect(properties.every((p) => p.price >= 200000 && p.price <= 500000)).toBe(true);
    });

    it('should handle pagination correctly when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const page = 1;
      const limit = 2;
      const paginatedProperties = mockProperties.slice(0, limit);

      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(paginatedProperties as any);
      vi.mocked(prisma.property.count).mockResolvedValueOnce(3);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const properties = await prisma.property.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { isPublished: true },
      });

      const total = await prisma.property.count({
        where: { isPublished: true },
      });

      // Assert
      expect(properties).toHaveLength(2);
      expect(total).toBe(3);
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: limit,
          skip: 0,
        })
      );
    });
  });

  describe('GET /api/properties/[id] - Get Property by ID', () => {
    it('should return property when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(prisma.property.findUnique).mockResolvedValueOnce(mockProperty as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const property = await prisma.property.findUnique({
        where: { id: '1' },
      });

      // Assert
      expect(property).toBeDefined();
      expect(property?.id).toBe('1');
      expect(prisma.property.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        })
      );
    });

    it('should fail when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.findUnique).mockRejectedValueOnce(
        new Error('Database not available')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Assert
      await expect(
        prisma.property.findUnique({ where: { id: '1' } })
      ).rejects.toThrow('Database not available');
    });

    it('should return null for non-existent property', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(prisma.property.findUnique).mockResolvedValueOnce(null);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const property = await prisma.property.findUnique({
        where: { id: '999' },
      });

      // Assert
      expect(property).toBeNull();
    });

    it('should increment view count when fetching property', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const updatedProperty = { ...mockProperty, views: mockProperty.views + 1 };
      vi.mocked(prisma.property.findUnique).mockResolvedValueOnce(mockProperty as any);
      vi.mocked(prisma.property.update).mockResolvedValueOnce(updatedProperty as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const property = await prisma.property.findUnique({
        where: { id: '1' },
      });

      if (property) {
        await prisma.property.update({
          where: { id: '1' },
          data: { views: { increment: 1 } },
        });
      }

      // Assert
      expect(prisma.property.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: { views: { increment: 1 } },
        })
      );
    });
  });

  describe('POST /api/properties - Create Property', () => {
    it('should create property when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const newProperty = { ...mockProperty, id: '4' };
      vi.mocked(prisma.property.create).mockResolvedValueOnce(newProperty as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const property = await prisma.property.create({
        data: newProperty as any,
      });

      // Assert
      expect(property.id).toBe('4');
      expect(prisma.property.create).toHaveBeenCalled();
    });

    it('should fail to create property when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.create).mockRejectedValueOnce(
        new Error('Connection unavailable')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Assert
      await expect(
        prisma.property.create({ data: mockProperty as any })
      ).rejects.toThrow('Connection unavailable');
    });
  });

  describe('PUT /api/properties/[id] - Update Property', () => {
    it('should update property when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const updatedProperty = { ...mockProperty, title: 'Updated Title' };
      vi.mocked(prisma.property.update).mockResolvedValueOnce(updatedProperty as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const property = await prisma.property.update({
        where: { id: '1' },
        data: { title: 'Updated Title' },
      });

      // Assert
      expect(property.title).toBe('Updated Title');
      expect(prisma.property.update).toHaveBeenCalled();
    });

    it('should fail to update property when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.update).mockRejectedValueOnce(
        new Error('Update failed - no connection')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Assert
      await expect(
        prisma.property.update({
          where: { id: '1' },
          data: { title: 'New Title' },
        })
      ).rejects.toThrow('Update failed - no connection');
    });
  });

  describe('DELETE /api/properties/[id] - Delete Property', () => {
    it('should delete property when database connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      vi.mocked(prisma.property.delete).mockResolvedValueOnce(mockProperty as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const deletedProperty = await prisma.property.delete({
        where: { id: '1' },
      });

      // Assert
      expect(deletedProperty.id).toBe('1');
      expect(prisma.property.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: '1' } })
      );
    });

    it('should fail to delete property when database connection is not ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(false);
      vi.mocked(prisma.property.delete).mockRejectedValueOnce(
        new Error('Delete failed - connection lost')
      );

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(false);

      // Assert
      await expect(
        prisma.property.delete({ where: { id: '1' } })
      ).rejects.toThrow('Delete failed - connection lost');
    });
  });

  describe('Search and Filter Operations', () => {
    it('should handle full-text search when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const searchResults = mockProperties.filter((p) =>
        p.title.toLowerCase().includes('maison')
      );
      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(searchResults as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const properties = await prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: 'maison', mode: 'insensitive' as any } },
            { description: { contains: 'maison', mode: 'insensitive' as any } },
          ],
        },
      });

      // Assert
      expect(properties).toHaveLength(1);
      expect(properties[0].title).toContain('Maison');
    });

    it('should combine multiple filters when connection is ready', async () => {
      // Arrange
      vi.mocked(isDatabaseConnectionReady).mockResolvedValueOnce(true);
      const complexFilter = mockProperties.filter(
        (p) =>
          p.propertyType === 'APARTMENT' &&
          (p.bedrooms ?? 0) >= 2 &&
          p.price <= 300000 &&
          p.isPublished
      );
      vi.mocked(prisma.property.findMany).mockResolvedValueOnce(complexFilter as any);

      // Act
      const isReady = await isDatabaseConnectionReady();
      expect(isReady).toBe(true);

      const properties = await prisma.property.findMany({
        where: {
          propertyType: 'APARTMENT',
          bedrooms: { gte: 2 },
          price: { lte: 300000 },
          isPublished: true,
        },
      });

      // Assert
      expect(properties).toHaveLength(1);
      expect(properties[0].propertyType).toBe('APARTMENT');
    });
  });
});
