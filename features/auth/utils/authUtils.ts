import { NextRequest } from 'next/server';
import { auth } from '@/infrastructure/auth/auth-config';
import { headers } from 'next/headers';

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  error?: string;
}

/**
 * Vérifie l'authentification à partir de Better Auth session
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      // En mode développement, autoriser l'accès sans authentification
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          user: {
            id: 'dev-admin',
            email: 'admin@imopanorama.mg',
            role: 'ADMIN'
          }
        };
      }

      return {
        success: false,
        error: 'Session manquante'
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role || 'CLIENT',
        firstName: session.user.firstName || undefined,
        lastName: session.user.lastName || undefined,
        phone: session.user.phone || undefined,
      }
    };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la session:', error);
    return {
      success: false,
      error: 'Erreur de vérification de session'
    };
  }
}
