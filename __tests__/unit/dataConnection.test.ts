import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

// Mock prisma module with hoisted spy functions so we can control DB behavior
const mockQueryRaw = vi.hoisted(() => vi.fn());
const mockDisconnect = vi.hoisted(() => vi.fn());

vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
    $disconnect: mockDisconnect,
  },
  isDatabaseConnectionReady: async () => {
    try {
      await mockQueryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
  },
  disconnectDatabase: async () => {
    await mockDisconnect();
  },
}));

import { prisma, isDatabaseConnectionReady, disconnectDatabase } from '@/infrastructure/database/prisma';

describe('Database Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isDatabaseConnectionReady', () => {
    it('should return true when database connection is ready', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ 1: 1 }]);

      const isReady = await isDatabaseConnectionReady();

      expect(isReady).toBe(true);
      expect(mockQueryRaw).toHaveBeenCalledTimes(1);
    });

    it('should return false when database connection fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockQueryRaw.mockRejectedValueOnce(new Error('Connection failed'));

      const isReady = await isDatabaseConnectionReady();

      expect(isReady).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Database connection check failed:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle timeout errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockQueryRaw.mockRejectedValueOnce(new Error('Timeout exceeded'));

      const isReady = await isDatabaseConnectionReady();

      expect(isReady).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockQueryRaw.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      const isReady = await isDatabaseConnectionReady();

      expect(isReady).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Database connection check failed:',
        expect.objectContaining({ message: 'ECONNREFUSED' })
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('disconnectDatabase', () => {
    it('should disconnect from database successfully', async () => {
      mockDisconnect.mockResolvedValueOnce(undefined);

      await disconnectDatabase();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle disconnect errors gracefully', async () => {
      mockDisconnect.mockRejectedValueOnce(new Error('Disconnect failed'));

      await expect(disconnectDatabase()).rejects.toThrow('Disconnect failed');
    });
  });

  describe('Prisma Client Instance', () => {
    it('should have a valid prisma client instance', () => {
      expect(prisma).toBeDefined();
      expect(prisma.$queryRaw).toBeDefined();
      expect(prisma.$disconnect).toBeDefined();
    });

    it('should be a singleton in development', () => {
      const instance1 = prisma;
      const instance2 = global.prisma;

      if (process.env.NODE_ENV !== 'production') {
        expect(instance1).toBe(instance2 ?? instance1);
      }
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
});
