import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/infrastructure/logger/logger';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type definition for a Next.js API route handler.
 * Accepts a request and optional dynamic route context (e.g. `{ params: { id } }`).
 */
type RouteHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Map of known Prisma error codes to user-friendly HTTP responses.
 * Centralises database error translation so individual routes don't have to.
 */
const PRISMA_ERROR_MAP: Record<string, { message: string; status: number }> = {
  P2002: { message: 'Cette valeur existe déjà.', status: 400 },
  P2003: { message: "Impossible de supprimer cette ressource car elle est liée à d'autres données.", status: 400 },
  P2025: { message: 'Ressource introuvable.', status: 404 },
};

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Wraps an API route handler with standardised error handling.
 *
 * - Catches **all** errors thrown by `handler`.
 * - Translates common Prisma error codes into appropriate HTTP responses.
 * - Falls back to a generic 500 for any unrecognised error.
 *
 * @example
 * ```ts
 * export const GET = withErrorHandler(async (request) => {
 *   const data = await myService.list();
 *   return NextResponse.json({ success: true, data });
 * });
 * ```
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  };
}

/**
 * Builds a standardised JSON error response.
 *
 * @param message - Human-readable error message.
 * @param status  - HTTP status code (default `400`).
 */
export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Builds a standardised JSON success response.
 *
 * @param data   - Payload to include in the response body.
 * @param status - HTTP status code (default `200`).
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, ...data as object }, { status });
}

/**
 * Extracts a single dynamic-route parameter from the Next.js route context.
 *
 * @param context - The route context containing `params`.
 * @param key     - The parameter name to extract (e.g. `"id"`).
 * @returns The string value of the parameter.
 *
 * @example
 * ```ts
 * const id = await extractParam(context, 'id');
 * ```
 */
export async function extractParam(
  context: { params: Promise<Record<string, string>> } | undefined,
  key: string,
): Promise<string> {
  const params = await context!.params;
  return params[key];
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/**
 * Converts an unknown error into a consistent JSON response.
 * Handles known Prisma errors and logs anything unexpected.
 */
function handleApiError(error: unknown): NextResponse {
  const prismaError = error as { code?: string; meta?: { target?: string[] } };
  const mapped = prismaError.code ? PRISMA_ERROR_MAP[prismaError.code] : undefined;

  if (mapped) {
    // For P2002 we can include the conflicting field name when available
    const message =
      prismaError.code === 'P2002' && prismaError.meta?.target?.[0]
        ? `Cette valeur pour ${prismaError.meta.target[0]} existe déjà.`
        : mapped.message;

    return apiError(message, mapped.status);
  }

  logger.error('Unhandled API error', error);
  return apiError('Erreur interne du serveur', 500);
}
