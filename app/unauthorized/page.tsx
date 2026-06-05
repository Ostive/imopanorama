'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirection automatique après 10 secondes
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg overflow-hidden">
        <div className={`bg-primary-600 p-4 flex justify-center`}>
          <div className="text-6xl">🚫</div>
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Accès non autorisé
          </h1>
          
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-left">
            <p className="text-lg text-foreground mb-2">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            
            {isAuthenticated && user ? (
              <p className="text-sm text-muted-foreground">
                Connecté en tant que: <span className="font-medium">{user.email}</span><br />
                Rôle actuel: <span className="font-medium">{user.role}</span><br />
                Cette page nécessite un rôle <span className="font-medium">admin</span> ou <span className="font-medium">super_admin</span>.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Vous n'êtes pas connecté. Veuillez vous connecter avec un compte disposant des droits nécessaires.
              </p>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Redirection automatique dans <span className="font-medium">{countdown}</span> secondes...
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              href="/"
              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm`}
            >
              Retour à l'accueil
            </Link>
            
            {!isAuthenticated && (
              <Link
                href="/login"
                className={`inline-flex items-center justify-center px-4 py-2 border border-primary-300 text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-card hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm`}
              >
                Se connecter
              </Link>
            )}
            
            <Link
              href="/auth-test"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-foreground bg-card hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
            >
              Tester l'authentification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
