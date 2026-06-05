import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
  boundedIntParam,
  parseEnumParam,
  validationError,
  withErrorHandler,
} from '@/infrastructure/middleware/api-handler';

vi.mock('@/infrastructure/logger/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('api-handler helpers', () => {
  it('returns structured validation errors with fieldErrors', async () => {
    const schema = z.object({ email: z.string().email('Email invalide') });
    const result = schema.safeParse({ email: 'bad-email' });
    expect(result.success).toBe(false);
    if (result.success) return;

    const response = validationError(result.error.issues);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Certains champs sont invalides');
    expect(body.fieldErrors.email).toBe('Email invalide');
    expect(body.issues).toHaveLength(1);
  });

  it('maps Prisma missing-column errors to a migration message', async () => {
    const handler = withErrorHandler(async () => {
      throw { code: 'P2022' };
    });

    const response = await handler(new NextRequest('http://localhost/api/test'));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toContain('migrations');
  });

  it('maps Zod errors thrown from a route handler', async () => {
    const handler = withErrorHandler(async () => {
      z.object({ title: z.string().min(1, 'Titre requis') }).parse({ title: '' });
      return NextResponse.json({ ok: true });
    });

    const response = await handler(new NextRequest('http://localhost/api/test'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.fieldErrors.title).toBe('Titre requis');
  });

  it('bounds integer query parameters and parses enum values', () => {
    const sp = new URLSearchParams('page=-50&limit=9999');

    expect(boundedIntParam(sp, 'page', 1, 1, 100)).toBe(1);
    expect(boundedIntParam(sp, 'limit', 20, 1, 100)).toBe(100);
    expect(parseEnumParam('HIGH', ['LOW', 'HIGH'] as const)).toBe('HIGH');
    expect(parseEnumParam('BAD', ['LOW', 'HIGH'] as const)).toBeUndefined();
  });
});
