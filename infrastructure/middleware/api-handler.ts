import { NextRequest, NextResponse } from 'next/server';
import { ZodError, type ZodIssue } from 'zod';
import { logger } from '@/infrastructure/logger/logger';

/* eslint-disable @typescript-eslint/no-explicit-any */

type RouteHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

const PRISMA_ERROR_MAP: Record<string, { message: string; status: number }> = {
  P2002: { message: 'Cette valeur existe deja.', status: 400 },
  P2003: { message: "Impossible de supprimer cette ressource car elle est liee a d'autres donnees.", status: 400 },
  P2022: { message: 'La base de donnees n est pas alignee avec le schema. Lancez les migrations.', status: 503 },
  P2025: { message: 'Ressource introuvable.', status: 404 },
};

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  };
}

export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, ...data as object }, { status });
}

export function fieldErrorsFromIssues(issues: ZodIssue[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path.join('.') || 'form';
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}

export function validationError(issues: ZodIssue[], message = 'Certains champs sont invalides'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      fieldErrors: fieldErrorsFromIssues(issues),
      issues,
    },
    { status: 400 },
  );
}

export function boundedIntParam(sp: URLSearchParams, key: string, fallback: number, min: number, max: number): number {
  const raw = parseInt(sp.get(key) || String(fallback), 10);
  if (!Number.isFinite(raw)) return fallback;
  return Math.min(Math.max(raw, min), max);
}

export function parseEnumParam<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  return value && allowed.includes(value as T) ? value as T : undefined;
}

export async function extractParam(
  context: { params: Promise<Record<string, string>> } | undefined,
  key: string,
): Promise<string> {
  const params = await context!.params;
  return params[key];
}

function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return validationError(error.issues);
  }

  const prismaError = error as { code?: string; meta?: { target?: string[] } };
  const mapped = prismaError.code ? PRISMA_ERROR_MAP[prismaError.code] : undefined;

  if (mapped) {
    const message =
      prismaError.code === 'P2002' && prismaError.meta?.target?.[0]
        ? `Cette valeur pour ${prismaError.meta.target[0]} existe deja.`
        : mapped.message;

    return apiError(message, mapped.status);
  }

  logger.error('Unhandled API error', error);
  return apiError('Erreur interne du serveur', 500);
}
