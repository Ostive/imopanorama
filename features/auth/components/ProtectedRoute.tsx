'use client'

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageSkeleton } from '@/shared/components/admin/AdminPageSkeleton';
import NotFound from '@/app/not-found';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackUrl?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermission,
  fallbackUrl = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasRole, hasPermission, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Attendre la vérification de l'auth

    // Vérifier l'authentification
    if (requireAuth && !isAuthenticated) {
      const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(window.location.pathname)}`;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, loading, requireAuth, router, fallbackUrl]);

  // Afficher un skeleton pendant la vérification
  if (loading) {
    return <AdminPageSkeleton />;
  }

  // Vérifications finales
  if (requireAuth && !isAuthenticated) {
    return null; // Redirect en cours
  }

  // Show 404 page if unauthorized (keeps URL intact)
  if ((requiredRole && !hasRole(requiredRole)) || (requiredPermission && !hasPermission(requiredPermission))) {
    return <NotFound />;
  }

  return <>{children}</>;
}
