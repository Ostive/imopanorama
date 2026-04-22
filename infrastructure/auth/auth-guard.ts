/**
 * @module infrastructure/auth/auth-guard
 * @description Role-based access control helpers for API routes.
 *
 * Each function verifies the caller's session and role, returning a
 * standardised `AuthResult` that the route handler can use to short-circuit:
 *
 * ```ts
 * const { authorized, session, errorResponse } = await requireAdmin(request);
 * if (!authorized) return errorResponse!;
 * // … proceed with session.user
 * ```
 */

import { auth } from '@/infrastructure/auth/auth-config';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported application roles, ordered from least to most privileged. */
type UserRole = 'client' | 'agent' | 'admin' | 'super_admin';

/** Return type shared by all `require*` functions. */
interface AuthResult {
  /** `true` when the caller satisfies the role requirement. */
  authorized: boolean;
  /** The full session object, or `null` when unauthenticated. */
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  /** Pre-built JSON response to return when `authorized` is `false`. */
  errorResponse?: NextResponse;
}

// ---------------------------------------------------------------------------
// Role sets
// ---------------------------------------------------------------------------

/** Roles considered "admin". */
const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin'];

/** Roles considered "staff" (agents + admins). */
const STAFF_ROLES: UserRole[] = ['admin', 'super_admin', 'agent'];

// ---------------------------------------------------------------------------
// Core session retrieval
// ---------------------------------------------------------------------------

/**
 * Resolve the current session from the request (or from Next.js headers if
 * no `Request` object is available, e.g. in Server Components).
 */
async function getAuthSession(request?: Request): Promise<AuthResult> {
  const reqHeaders = request ? request.headers : await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return {
      authorized: false,
      session: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 },
      ),
    };
  }

  return { authorized: true, session };
}

// ---------------------------------------------------------------------------
// Public guard functions
// ---------------------------------------------------------------------------

/**
 * Require **any** authenticated user.
 * Returns a 401 if the caller is not logged in.
 */
export async function requireAuth(request?: Request): Promise<AuthResult> {
  return getAuthSession(request);
}

/**
 * Require an **admin** or **super_admin** role.
 * Returns a 403 if the role is insufficient or 401 if unauthenticated.
 */
export async function requireAdmin(request?: Request): Promise<AuthResult> {
  return requireRole(request, ADMIN_ROLES);
}

/**
 * Require a **staff** role (admin, super_admin, or agent).
 * Returns a 403 if the role is insufficient or 401 if unauthenticated.
 */
export async function requireStaff(request?: Request): Promise<AuthResult> {
  return requireRole(request, STAFF_ROLES);
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

/**
 * Generic role check – shared logic for `requireAdmin` and `requireStaff`.
 */
async function requireRole(request: Request | undefined, allowedRoles: UserRole[]): Promise<AuthResult> {
  const result = await getAuthSession(request);
  if (!result.authorized || !result.session) return result;

  const userRole = (result.session.user.role?.toLowerCase() || 'client') as UserRole;

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      session: result.session,
      errorResponse: NextResponse.json(
        { success: false, error: 'Accès refusé' },
        { status: 403 },
      ),
    };
  }

  return result;
}
